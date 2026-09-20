using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    public class MentorsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public MentorsController(AppDbContext db, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _db = db;
            _userManager = userManager;
            _env = env;
        }

        // 🔓 Public: Get mentors
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _db.Mentors.ToListAsync();
            return Ok(mentors);
        }

        // Helper to save image file
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

        // 🔒 Post: Add a mentor (Admin only) and create associated user account
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateMentor([FromForm] MentorUpsertDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest("Email is required for creating a mentor user account.");
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            // 1. Create the ApplicationUser first
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmailConfirmed = true,
                FullName = dto.Name,
                IsActive = true
            };

            var password = string.IsNullOrWhiteSpace(dto.Password) ? "Mentor@2026" : dto.Password;
            var createRes = await _userManager.CreateAsync(user, password);
            if (!createRes.Succeeded)
            {
                var errors = string.Join(", ", createRes.Errors.Select(e => e.Description));
                return BadRequest($"Failed to create user account for mentor: {errors}");
            }

            // Assign Mentor role to user
            await _userManager.AddToRoleAsync(user, "Mentor");

            // Save uploaded image if present
            var imageUrl = "/uploads/default-mentor.png";
            if (dto.ImageFile != null)
            {
                var savedPath = await SaveImageAsync(dto.ImageFile);
                if (savedPath != null) imageUrl = savedPath;
            }
            else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                imageUrl = dto.ImageUrl;
            }

            // 2. Create the Mentor profile
            var mentor = new Mentor
            {
                Name = dto.Name,
                Title = dto.Title,
                Institution = dto.Institution,
                ImageUrl = imageUrl,
                Subject = dto.Subject,
                Bio = dto.Bio,
                Rating = dto.Rating,
                BookingPrice = dto.BookingPrice,
                Email = dto.Email,
                UserId = user.Id
            };

            _db.Mentors.Add(mentor);
            await _db.SaveChangesAsync();

            return Ok(mentor);
        }

        // 🔒 Put: Update a mentor profile and their associated user
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Mentor")]
        public async Task<IActionResult> UpdateMentor(Guid id, [FromForm] MentorUpsertDto dto)
        {
            var mentor = await _db.Mentors.FindAsync(id);
            if (mentor == null) return NotFound("Mentor not found");

            mentor.Name = dto.Name;
            mentor.Title = dto.Title;
            mentor.Institution = dto.Institution;
            mentor.Subject = dto.Subject;
            mentor.Bio = dto.Bio;
            mentor.Rating = dto.Rating;
            mentor.BookingPrice = dto.BookingPrice;
            mentor.Email = dto.Email;

            // Handle image file update
            if (dto.ImageFile != null)
            {
                var savedPath = await SaveImageAsync(dto.ImageFile);
                if (savedPath != null) mentor.ImageUrl = savedPath;
            }
            else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            {
                mentor.ImageUrl = dto.ImageUrl;
            }

            // If user exists, update their full name and email
            if (!string.IsNullOrEmpty(mentor.UserId))
            {
                var user = await _userManager.FindByIdAsync(mentor.UserId);
                if (user != null)
                {
                    user.FullName = dto.Name;
                    user.Email = dto.Email;
                    user.UserName = dto.Email;
                    await _userManager.UpdateAsync(user);
                }
            }

            await _db.SaveChangesAsync();
            return Ok(mentor);
        }

        // 🔒 Delete: Remove a mentor and their user account
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMentor(Guid id)
        {
            var mentor = await _db.Mentors.FindAsync(id);
            if (mentor == null) return NotFound("Mentor not found");

            // Delete associated user account
            if (!string.IsNullOrEmpty(mentor.UserId))
            {
                var user = await _userManager.FindByIdAsync(mentor.UserId);
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }
            }

            _db.Mentors.Remove(mentor);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Mentor and associated user account deleted successfully" });
        }

        // 🔒 Book a mentor session
        [HttpPost("{id}/book")]
        public async Task<IActionResult> BookMentor(Guid id, [FromBody] BookingRequestDto dto)
        {
            var mentor = await _db.Mentors.FindAsync(id);
            if (mentor == null) return NotFound("Mentor not found");

            return Ok(new
            {
                message = "Booking confirmed successfully",
                mentorName = mentor.Name,
                date = dto.Date,
                timeSlot = dto.TimeSlot,
                meetingLink = "https://meet.google.com/abc-defg-hij"
            });
        }
    }

    public class MentorUpsertDto
    {
        public string Name { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Institution { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public string? Bio { get; set; }
        public double Rating { get; set; }
        public double BookingPrice { get; set; }
        public string Email { get; set; } = default!;
        public string? Password { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class BookingRequestDto
    {
        public string Date { get; set; } = default!;
        public string TimeSlot { get; set; } = default!;
    }
}
