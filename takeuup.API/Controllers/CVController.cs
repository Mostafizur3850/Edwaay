using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CVController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CVController(AppDbContext db)
        {
            _db = db;
        }

        private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // 🔒 Get CV for current user
        [HttpGet]
        public async Task<IActionResult> GetCV()
        {
            var cv = await _db.UserResumes.FirstOrDefaultAsync(r => r.UserId == UserId.ToString());
            if (cv == null) return NotFound("CV not found");

            return Ok(cv);
        }

        // 🔒 Save/Upsert CV
        [HttpPost]
        public async Task<IActionResult> SaveCV([FromBody] CVSaveDto dto)
        {
            var cv = await _db.UserResumes.FirstOrDefaultAsync(r => r.UserId == UserId.ToString());

            if (cv == null)
            {
                cv = new UserResume
                {
                    UserId = UserId.ToString()
                };
                _db.UserResumes.Add(cv);
            }

            cv.FullName = dto.FullName;
            cv.Title = dto.Title;
            cv.Email = dto.Email;
            cv.Phone = dto.Phone;
            cv.Summary = dto.Summary;
            cv.ExperienceJson = dto.ExperienceJson;
            cv.EducationJson = dto.EducationJson;
            cv.SkillsJson = dto.SkillsJson;
            cv.SetUpdated();

            await _db.SaveChangesAsync();
            return Ok(cv);
        }
    }

    public class CVSaveDto
    {
        public string FullName { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Phone { get; set; } = default!;
        public string? Summary { get; set; }
        public string? ExperienceJson { get; set; }
        public string? EducationJson { get; set; }
        public string? SkillsJson { get; set; }
    }
}
