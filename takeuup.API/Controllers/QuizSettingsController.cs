using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizSettingsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public QuizSettingsController(AppDbContext db)
        {
            _db = db;
        }

        // ================= CATEGORIES =================

        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.QuizCategories
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync();
            return Ok(categories);
        }

        [HttpPost("categories")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] QuizCategory category)
        {
            if (string.IsNullOrWhiteSpace(category.Name))
                return BadRequest("Category name is required.");

            category.Slug = category.Name.ToLower().Replace(" ", "-");
            category.CreatedAt = DateTimeOffset.UtcNow;
            category.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.QuizCategories.AddAsync(category);
            await _db.CommitAsync();
            return Ok(category);
        }

        [HttpPut("categories/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] QuizCategory updated)
        {
            var category = await _db.QuizCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found.");

            category.Name = updated.Name;
            category.Slug = updated.Name.ToLower().Replace(" ", "-");
            category.IsActive = updated.IsActive;
            category.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.CommitAsync();
            return Ok(category);
        }

        [HttpDelete("categories/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _db.QuizCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found.");

            _db.QuizCategories.Remove(category);
            await _db.CommitAsync();
            return Ok("Category deleted successfully.");
        }

        // ================= SUBJECTS =================

        [HttpGet("subjects")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSubjects([FromQuery] Guid? categoryId)
        {
            var query = _db.QuizSubjects.Where(x => x.IsActive);
            if (categoryId.HasValue)
            {
                query = query.Where(x => x.QuizCategoryId == categoryId.Value);
            }
            var subjects = await query.OrderBy(x => x.Name).ToListAsync();
            return Ok(subjects);
        }

        [HttpPost("subjects")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSubject([FromBody] QuizSubject subject)
        {
            if (string.IsNullOrWhiteSpace(subject.Name))
                return BadRequest("Subject name is required.");

            subject.Slug = subject.Name.ToLower().Replace(" ", "-");
            subject.CreatedAt = DateTimeOffset.UtcNow;
            subject.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.QuizSubjects.AddAsync(subject);
            await _db.CommitAsync();
            return Ok(subject);
        }

        [HttpPut("subjects/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSubject(Guid id, [FromBody] QuizSubject updated)
        {
            var subject = await _db.QuizSubjects.FindAsync(id);
            if (subject == null) return NotFound("Subject not found.");

            // Check if name is being changed
            if (subject.Name != updated.Name)
            {
                var hasQuestions = await _db.Questions.AnyAsync(q => q.Subject == subject.Name);
                if (hasQuestions)
                {
                    // Store the requested name as a pending name change
                    subject.PendingName = updated.Name;
                    subject.IsActive = updated.IsActive;
                    subject.QuizCategoryId = updated.QuizCategoryId;
                    subject.UpdatedAt = DateTimeOffset.UtcNow;

                    await _db.CommitAsync();
                    return Ok(new { subject, pending = true, message = "Name change request submitted for Admin approval because this subject has questions." });
                }
            }

            // Normal update (either name is not changed, or there are no questions)
            subject.Name = updated.Name;
            subject.Slug = updated.Name.ToLower().Replace(" ", "-");
            subject.IsActive = updated.IsActive;
            subject.QuizCategoryId = updated.QuizCategoryId;
            subject.PendingName = null; // Clear if it was set
            subject.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.CommitAsync();
            return Ok(subject);
        }

        [HttpDelete("subjects/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            var subject = await _db.QuizSubjects.FindAsync(id);
            if (subject == null) return NotFound("Subject not found.");

            var hasQuestions = await _db.Questions.AnyAsync(q => q.Subject == subject.Name);
            if (hasQuestions)
            {
                return BadRequest("Cannot delete subject because questions are already added to it.");
            }

            _db.QuizSubjects.Remove(subject);
            await _db.CommitAsync();
            return Ok("Subject deleted successfully.");
        }

        [HttpGet("subjects/pending-name-changes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingNameChanges()
        {
            var subjects = await _db.QuizSubjects
                .Where(x => !string.IsNullOrEmpty(x.PendingName))
                .OrderBy(x => x.Name)
                .ToListAsync();
            return Ok(subjects);
        }

        [HttpPost("subjects/{id}/approve-name-change")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveSubjectNameChange(Guid id)
        {
            var subject = await _db.QuizSubjects.FindAsync(id);
            if (subject == null) return NotFound("Subject not found.");
            if (string.IsNullOrEmpty(subject.PendingName)) return BadRequest("No pending name change request exists for this subject.");

            var oldName = subject.Name;
            var newName = subject.PendingName;

            subject.Name = newName;
            subject.Slug = newName.ToLower().Replace(" ", "-");
            subject.PendingName = null;
            subject.UpdatedAt = DateTimeOffset.UtcNow;

            // Update all questions that were associated with the old subject name
            var questions = await _db.Questions.Where(q => q.Subject == oldName).ToListAsync();
            foreach (var q in questions)
            {
                q.Subject = newName;
            }

            await _db.CommitAsync();
            return Ok(new { message = $"Subject name change from '{oldName}' to '{newName}' approved successfully, and {questions.Count} questions updated." });
        }

        [HttpPost("subjects/{id}/reject-name-change")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectSubjectNameChange(Guid id)
        {
            var subject = await _db.QuizSubjects.FindAsync(id);
            if (subject == null) return NotFound("Subject not found.");
            if (string.IsNullOrEmpty(subject.PendingName)) return BadRequest("No pending name change request exists for this subject.");

            subject.PendingName = null;
            subject.UpdatedAt = DateTimeOffset.UtcNow;

            await _db.CommitAsync();
            return Ok(new { message = "Subject name change request rejected." });
        }
    }
}
