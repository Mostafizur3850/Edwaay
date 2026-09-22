using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace takeuup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("student-tracker")]
        public async Task<IActionResult> GetStudentTracker([FromQuery] string goal = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            // FIX: Parse Guid first to avoid SQL translation issues with .ToString()
            ECommerce.Domain.Entities.UserProfile profile = null;
            if (Guid.TryParse(userIdStr, out var parsedGuid))
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId == parsedGuid);
            }
            if (profile == null)
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.Email == userIdStr);
            }

            var goalName = !string.IsNullOrEmpty(goal) ? goal : (profile?.ActiveGoalName ?? profile?.StudentClass ?? "HSC");

            string categoryKeyword = "";
            var normalizedGoal = goalName.ToLowerInvariant();
            
            if (normalizedGoal.Contains("বিসিএস") || normalizedGoal.Contains("bcs") || normalizedGoal.Contains("জবস"))
            {
                categoryKeyword = "bcs";
            }
            else if (normalizedGoal.Contains("এডমিশন") || normalizedGoal.Contains("admission") || normalizedGoal.Contains("ভার্সিটি") || normalizedGoal.Contains("মেডিকেল") || normalizedGoal.Contains("ইঞ্জিনিয়ারিং"))
            {
                categoryKeyword = "admission";
            }
            else if (normalizedGoal.Contains("এইচএসসি") || normalizedGoal.Contains("hsc"))
            {
                categoryKeyword = "hsc";
            }
            else if (normalizedGoal.Contains("এসএসসি") || normalizedGoal.Contains("ssc"))
            {
                categoryKeyword = "ssc";
            }
            else 
            {
                categoryKeyword = normalizedGoal;
            }

            var quizCategory = await _db.QuizCategories
                .FirstOrDefaultAsync(c => c.IsActive && (c.Name.ToLower().Contains(categoryKeyword) || categoryKeyword.Contains(c.Name.ToLower())));

            var results = new List<object>();

            if (quizCategory != null)
            {
                var subjects = await _db.QuizSubjects
                    .Where(s => s.QuizCategoryId == quizCategory.Id && s.IsActive)
                    .OrderBy(s => s.Name)
                    .ToListAsync();

                foreach (var subject in subjects)
                {
                    // Fetch user's quiz results for this specific subject
                    var userQuizzes = await _db.UserQuizResults
                        .Where(q => q.UserId == userIdStr && q.Subject == subject.Name)
                        .ToListAsync();

                    int totalQuestions = userQuizzes.Sum(q => q.TotalQuestions);
                    int totalCorrect = userQuizzes.Sum(q => q.Score);
                    int progress = totalQuestions > 0 ? (int)Math.Round((double)totalCorrect * 100 / totalQuestions) : 0;

                    results.Add(new
                    {
                        name = subject.Name,
                        progress = progress,
                        topic = "অধ্যায় ও বেসিক ধারণা (Running Topic)", 
                        totalQuestions = totalQuestions,
                        correctAnswers = totalCorrect
                    });
                }
            }

            return Ok(new
            {
                goalName = goalName,
                subjects = results
            });
        }

        [HttpGet("get-routine")]
        public async Task<IActionResult> GetRoutine()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            ECommerce.Domain.Entities.UserProfile profile = null;
            if (Guid.TryParse(userIdStr, out var parsedGuid))
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId == parsedGuid);
            }
            if (profile == null)
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.Email == userIdStr);
            }

            if (profile == null) return NotFound();

            return Ok(new { routineTasks = profile.RoutineTasksJson });
        }

        public class UpdateRoutineDto
        {
            public string routineTasksJson { get; set; }
        }

        [HttpPut("update-routine")]
        public async Task<IActionResult> UpdateRoutine([FromBody] UpdateRoutineDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            ECommerce.Domain.Entities.UserProfile profile = null;
            if (Guid.TryParse(userIdStr, out var parsedGuid))
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId == parsedGuid);
            }
            if (profile == null)
            {
                profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.Email == userIdStr);
            }

            if (profile == null) return NotFound();

            profile.RoutineTasksJson = dto.routineTasksJson;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Routine updated" });
        }
    }
}
