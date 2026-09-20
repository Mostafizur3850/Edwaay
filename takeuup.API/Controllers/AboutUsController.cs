using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AboutUsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public AboutUsController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // 🔓 Public: Fetch About Us Settings and Team members
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAboutUs()
        {
            var settings = await _db.AboutUsSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new AboutUsSettings
                {
                    HeroTitle = "Democratizing Education Across Bangladesh",
                    HeroSubtitle = "TakeUUp is more than just an ed-tech platform. It's a movement to bridge the gap between dreamers and achievers through technology, data, and mentorship.",
                    MissionText = "I started TakeUUp with a simple laptop and a massive vision: to fix the fragmentation in Bangladesh's competitive exam preparation system. Growing up, I saw brilliant students failing not because they lacked talent, but because they lacked resources and guidance. Expensive coaching centers in Dhaka were the only option, leaving rural students behind.",
                    VisionText = "Today, TakeUUp levels the playing field. We use AI to personalize learning, making premium education affordable and accessible to a student in a remote village just as it is to one in the capital.",
                    StatsJson = "[{\"label\": \"Active Students\", \"value\": \"50,000+\"}, {\"label\": \"Quizzes Taken\", \"value\": \"1.2M+\"}, {\"label\": \"Questions Solved\", \"value\": \"5M+\"}, {\"label\": \"Success Stories\", \"value\": \"1000+\"}]",
                    ValuesJson = "[{\"title\": \"Mission Driven\", \"desc\": \"We are obsessed with helping students achieve their academic dreams.\"}, {\"title\": \"Student First\", \"desc\": \"Every feature we build starts with the question: 'Does this help the student?'\"}, {\"title\": \"Fast & Reliable\", \"desc\": \"We believe technology should speed up learning, not slow it down.\"}, {\"title\": \"Accessible\", \"desc\": \"Quality education should be available to everyone, everywhere.\"}]"
                };
                _db.AboutUsSettings.Add(settings);
                await _db.SaveChangesAsync();
            }

            var members = await _db.AboutUsMembers
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();

            return Ok(new { settings, members });
        }

        private async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0) return null;
            
            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            
            return $"/uploads/{fileName}";
        }

        // 🔒 Admin: Update general settings
        [HttpPut("settings")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSettings([FromBody] AboutUsSettingsUpdateDto dto)
        {
            var settings = await _db.AboutUsSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new AboutUsSettings();
                _db.AboutUsSettings.Add(settings);
            }

            settings.HeroTitle = dto.HeroTitle;
            settings.HeroSubtitle = dto.HeroSubtitle;
            settings.MissionText = dto.MissionText;
            settings.VisionText = dto.VisionText;
            settings.StatsJson = dto.StatsJson;
            settings.ValuesJson = dto.ValuesJson;

            await _db.SaveChangesAsync();
            return Ok(settings);
        }

        // 🔒 Admin: Add member
        [HttpPost("members")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMember([FromForm] AboutUsMemberUpsertDto dto)
        {
            var imageUrl = "/uploads/default-member.png";
            if (dto.ImageFile != null)
            {
                var path = await SaveImageAsync(dto.ImageFile);
                if (path != null) imageUrl = path;
            }
            else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                imageUrl = dto.ImageUrl;
            }

            var member = new AboutUsMember
            {
                Name = dto.Name,
                Role = dto.Role,
                Bio = dto.Bio,
                ImageUrl = imageUrl,
                DisplayOrder = dto.DisplayOrder,
                LinkedinUrl = dto.LinkedinUrl,
                TwitterUrl = dto.TwitterUrl,
                Email = dto.Email
            };

            _db.AboutUsMembers.Add(member);
            await _db.SaveChangesAsync();
            return Ok(member);
        }

        // 🔒 Admin: Update member
        [HttpPut("members/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMember(Guid id, [FromForm] AboutUsMemberUpsertDto dto)
        {
            var member = await _db.AboutUsMembers.FindAsync(id);
            if (member == null) return NotFound("Member not found");

            member.Name = dto.Name;
            member.Role = dto.Role;
            member.Bio = dto.Bio;
            member.DisplayOrder = dto.DisplayOrder;
            member.LinkedinUrl = dto.LinkedinUrl;
            member.TwitterUrl = dto.TwitterUrl;
            member.Email = dto.Email;

            if (dto.ImageFile != null)
            {
                var path = await SaveImageAsync(dto.ImageFile);
                if (path != null) member.ImageUrl = path;
            }
            else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                member.ImageUrl = dto.ImageUrl;
            }

            await _db.SaveChangesAsync();
            return Ok(member);
        }

        // 🔒 Admin: Delete member
        [HttpDelete("members/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMember(Guid id)
        {
            var member = await _db.AboutUsMembers.FindAsync(id);
            if (member == null) return NotFound("Member not found");

            _db.AboutUsMembers.Remove(member);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Member deleted successfully" });
        }
    }

    public class AboutUsSettingsUpdateDto
    {
        public string HeroTitle { get; set; } = default!;
        public string HeroSubtitle { get; set; } = default!;
        public string MissionText { get; set; } = default!;
        public string VisionText { get; set; } = default!;
        public string StatsJson { get; set; } = default!;
        public string ValuesJson { get; set; } = default!;
    }

    public class AboutUsMemberUpsertDto
    {
        public string Name { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string Bio { get; set; } = default!;
        public int DisplayOrder { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? Email { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImageUrl { get; set; }
    }
}
