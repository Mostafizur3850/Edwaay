using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMediator _mediator;

        public CompaniesController(AppDbContext db, UserManager<ApplicationUser> userManager, IMediator mediator)
        {
            _db = db;
            _userManager = userManager;
            _mediator = mediator;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // 🔓 Public: Get all verified companies
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _db.Companies
                .Where(c => c.IsVerified)
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(companies);
        }

        // 🔒 Employer: Get current logged-in user's company profile
        [HttpGet("my-company")]
        public async Task<IActionResult> GetMyCompany()
        {
            var company = await _db.Companies
                .FirstOrDefaultAsync(c => c.UserId == UserId);
            if (company == null) return NotFound("No company registered for this user");
            return Ok(company);
        }

        // 🔒 Any Authenticated User: Register a new company profile (creates company as unverified, adds user to Employer role)
        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromBody] CompanyRegisterDto dto)
        {
            var existingCompany = await _db.Companies.FirstOrDefaultAsync(c => c.UserId == UserId);
            if (existingCompany != null)
                return BadRequest("You have already registered a company profile.");

            var command = new ECommerce.Application.Features.Companies.Commands.RegisterCompanyCommand(
                dto.Name,
                dto.Email,
                dto.Phone,
                dto.Website,
                dto.Logo,
                dto.Address,
                dto.Description,
                UserId
            );

            var company = await _mediator.Send(command);

            // Assign the user to the "Employer" role
            var user = await _userManager.FindByIdAsync(UserId);
            if (user != null)
            {
                if (!await _userManager.IsInRoleAsync(user, "Employer"))
                {
                    await _userManager.AddToRoleAsync(user, "Employer");
                }
            }

            return Ok(company);
        }

        // 🔒 Employer: Update own company details
        [HttpPut("my-company")]
        public async Task<IActionResult> UpdateMyCompany([FromBody] CompanyRegisterDto dto)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(c => c.UserId == UserId);
            if (company == null) return NotFound("No company found for this user");

            company.Name = dto.Name;
            company.Email = dto.Email;
            company.Phone = dto.Phone;
            company.Website = dto.Website;
            company.Logo = dto.Logo;
            company.Address = dto.Address;
            company.Description = dto.Description;

            company.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(company);
        }

        // 🔒 Admin: Get all companies (verified + pending)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminCompanies()
        {
            var companies = await _db.Companies
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            return Ok(companies);
        }

        // 🔒 Admin: Verify/Approve or Unverify a company profile
        [HttpPost("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyCompany(Guid id, [FromBody] VerifyCompanyDto dto)
        {
            var command = new ECommerce.Application.Features.Companies.Commands.VerifyCompanyCommand(id, dto.IsVerified);
            var company = await _mediator.Send(command);
            if (company == null) return NotFound("Company not found");

            return Ok(company);
        }

        // 🔒 Admin: Delete a company profile
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var company = await _db.Companies.FindAsync(id);
            if (company == null) return NotFound("Company not found");

            _db.Companies.Remove(company);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Company profile deleted successfully" });
        }
    }

    public class CompanyRegisterDto
    {
        public string Name { get; set; } = default!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? Logo { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
    }

    public class VerifyCompanyDto
    {
        public bool IsVerified { get; set; }
    }
}
