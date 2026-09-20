using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMediator _mediator;

        public JobsController(AppDbContext db, IMediator mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // 🔓 Public: Get jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobs([FromQuery] string? destination, [FromQuery] bool? isFeatured)
        {
            var query = _db.Jobs.AsQueryable();

            if (!string.IsNullOrEmpty(destination))
            {
                query = query.Where(j => j.Destination.ToLower() == destination.ToLower());
            }

            if (isFeatured.HasValue)
            {
                query = query.Where(j => j.IsFeatured == isFeatured.Value);
            }

            var jobs = await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
            return Ok(jobs);
        }

        // 🔒 Post: Create a job posting (Admin or Employer)
        [HttpPost]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<IActionResult> CreateJob([FromBody] JobUpsertDto dto)
        {
            string finalCompany = dto.Company;
            string? finalLogo = dto.CompanyLogo;
            Guid? finalCompanyId = dto.CompanyId;

            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin)
            {
                var company = await _db.Companies.FirstOrDefaultAsync(c => c.UserId == UserId.ToString());
                if (company == null)
                    return BadRequest("No company profile registered for your user. Please register your company first.");

                if (!company.IsVerified)
                    return BadRequest("Your company is pending verification by the administrator. You cannot post jobs yet.");

                finalCompany = company.Name;
                finalLogo = company.Logo;
                finalCompanyId = company.Id;
            }
            else if (dto.CompanyId.HasValue)
            {
                var company = await _db.Companies.FindAsync(dto.CompanyId.Value);
                if (company != null)
                {
                    finalCompany = company.Name;
                    finalLogo = company.Logo;
                    finalCompanyId = company.Id;
                }
            }

            var command = new ECommerce.Application.Features.Jobs.Commands.CreateJobCommand(
                dto.Title,
                finalCompany,
                dto.Location,
                dto.Salary,
                dto.Type,
                dto.Destination,
                dto.IsFeatured,
                dto.Description,
                dto.Requirements,
                dto.Responsibilities,
                dto.Benefits,
                dto.Category,
                dto.ExperienceLevel,
                finalLogo,
                finalCompanyId,
                dto.CategoryId
            );

            var job = await _mediator.Send(command);
            return Ok(job);
        }

        // 🔒 Put: Update a job posting (Admin or Employer)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<IActionResult> UpdateJob(Guid id, [FromBody] JobUpsertDto dto)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound("Job not found");

            string finalCompany = dto.Company;
            string? finalLogo = dto.CompanyLogo;
            Guid? finalCompanyId = dto.CompanyId;

            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin)
            {
                var company = await _db.Companies.FirstOrDefaultAsync(c => c.UserId == UserId.ToString());
                if (company == null)
                    return BadRequest("No company profile registered for your user. Please register your company first.");

                if (!company.IsVerified)
                    return BadRequest("Your company is pending verification by the administrator. You cannot post jobs yet.");

                finalCompany = company.Name;
                finalLogo = company.Logo;
                finalCompanyId = company.Id;
            }
            else if (dto.CompanyId.HasValue)
            {
                var company = await _db.Companies.FindAsync(dto.CompanyId.Value);
                if (company != null)
                {
                    finalCompany = company.Name;
                    finalLogo = company.Logo;
                    finalCompanyId = company.Id;
                }
            }

            job.Title = dto.Title;
            job.Company = finalCompany;
            job.Location = dto.Location;
            job.Salary = dto.Salary;
            job.Type = dto.Type;
            job.Destination = dto.Destination;
            job.IsFeatured = dto.IsFeatured;
            job.Description = dto.Description;
            job.Requirements = dto.Requirements;
            job.Responsibilities = dto.Responsibilities;
            job.Benefits = dto.Benefits;
            job.Category = dto.Category;
            job.ExperienceLevel = dto.ExperienceLevel;
            job.CompanyLogo = finalLogo;
            job.CompanyId = finalCompanyId;
            job.CategoryId = dto.CategoryId;

            job.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(job);
        }

        // 🔓 Public/Admin: Upload company logo
        [HttpPost("upload-logo")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadLogo(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/{fileName}";
            return Ok(new { url = fileUrl });
        }

        // 🔒 Delete job (Admin or Employer)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<IActionResult> DeleteJob(Guid id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound("Job not found");

            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Job deleted successfully" });
        }

        // 🔒 Apply to a job (Any authenticated user or student)
        [HttpPost("{id}/apply")]
        public async Task<IActionResult> Apply(Guid id, [FromBody] JobApplyDto dto)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound("Job not found");

            var application = new JobApplication
            {
                JobId = id,
                Name = dto.Name,
                Email = dto.Email,
                CVPath = dto.CVPath,
                Status = "Applied",
                TestScore = dto.TestScore
            };

            _db.JobApplications.Add(application);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully", applicationId = application.Id });
        }

        // 🔒 Get job applications (Admin or Employer)
        [HttpGet("applications")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<IActionResult> GetApplications()
        {
            var appsRaw = await _db.JobApplications
                .Include(a => a.Job)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var applications = appsRaw.Select(a => new
            {
                id = a.Id,
                jobId = a.JobId,
                jobTitle = a.Job?.Title,
                companyName = a.Job?.Company,
                name = a.Name,
                email = a.Email,
                cvPath = a.CVPath,
                status = a.Status,
                testScore = a.TestScore,
                interviewDetails = string.IsNullOrEmpty(a.InterviewDetails) ? null : JsonSerializer.Deserialize<object>(a.InterviewDetails, (JsonSerializerOptions)null),
                createdAt = a.CreatedAt
            }).ToList();

            return Ok(applications);
        }

        // 🔒 Update application status (Admin or Employer)
        [HttpPost("applications/{id}/status")]
        [Authorize(Roles = "Admin,Employer")]
        public async Task<IActionResult> UpdateApplicationStatus(Guid id, [FromBody] UpdateStatusDto dto)
        {
            var app = await _db.JobApplications.FindAsync(id);
            if (app == null) return NotFound("Application not found");

            app.Status = dto.Status;
            
            if (dto.InterviewDetails != null)
            {
                app.InterviewDetails = JsonSerializer.Serialize(dto.InterviewDetails);
            }

            app.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully" });
        }
    }

    public class JobUpsertDto
    {
        public string Title { get; set; } = default!;
        public string Company { get; set; } = default!;
        public string Location { get; set; } = default!;
        public string Salary { get; set; } = default!;
        public string Type { get; set; } = "Full-time";
        public string Destination { get; set; } = "Portal";
        public bool IsFeatured { get; set; }
        public string? Description { get; set; }
        public string? Requirements { get; set; }
        public string? Responsibilities { get; set; }
        public string? Benefits { get; set; }
        public string? Category { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? CompanyLogo { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? CategoryId { get; set; }
    }

    public class JobApplyDto
    {
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string CVPath { get; set; } = default!;
        public int? TestScore { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = default!;
        public object? InterviewDetails { get; set; }
    }
}
