using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class QuizzesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public QuizzesController(AppDbContext db)
        {
            _db = db;
        }

        private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // 🔓 Public: Get questions for a specific category/subject
        // 🔓 Public: Get questions for a specific category/subject
        [HttpGet("questions")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQuestions([FromQuery] string category, [FromQuery] string subject, [FromQuery] bool? includeAll)
        {
            var query = _db.Questions.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(q => q.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(subject))
            {
                query = query.Where(q => q.Subject.ToLower() == subject.ToLower());
            }

            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name);

            if (includeAll == true && (userRole == "Admin" || userRole == "teacher"))
            {
                if (userRole == "teacher")
                {
                    query = query.Where(q => q.CreatedBy == userEmail);
                }
            }
            else
            {
                query = query.Where(q => q.Status == "Approved" || q.Status == "Approved_PendingEdit" || q.Status == "Approved_PendingDelete");
            }

            var questions = await query.ToListAsync();

            if (questions.Count == 0)
            {
                var mockQuestions = new[]
                {
                    new {
                        id = Guid.NewGuid(),
                        accessLevel = "Free",
                        category = category ?? "HSC",
                        subject = subject ?? "Physics",
                        text = $"Sample Question 1 for {subject ?? "Physics"}: What is Newton's First Law?",
                        options = new[] { "Inertia", "F=ma", "Action-Reaction", "Gravity" },
                        correctAnswer = "0",
                        explanation = "Inertia is the tendency of objects to resist changes to their state of motion.",
                        status = "Approved",
                        createdBy = "Admin",
                        createdAt = DateTimeOffset.UtcNow
                    }
                };
                return Ok(mockQuestions);
            }

            var response = questions.Select(q => new
            {
                id = q.Id,
                accessLevel = q.AccessLevel,
                category = q.Category,
                subject = q.Subject,
                text = q.Text,
                options = JsonSerializer.Deserialize<string[]>(q.OptionsJson),
                correctAnswer = q.CorrectAnswer,
                explanation = q.Explanation,
                createdBy = q.CreatedBy ?? "Admin",
                createdAt = q.CreatedAt,
                status = q.Status,
                approvedBy = q.ApprovedBy,
                correctionComment = q.CorrectionComment
            });

            return Ok(response);
        }

        // 🔒 Post question (Admin or Teacher)
        [HttpPost("questions")]
        [Authorize(Roles = "Admin,teacher")]
        public async Task<IActionResult> AddQuestion([FromBody] QuestionDto dto)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name) ?? "System";
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var status = "Pending";

            var question = new Question
            {
                AccessLevel = dto.AccessLevel ?? "Free",
                Category = dto.Category,
                Subject = dto.Subject,
                Text = dto.Text,
                OptionsJson = JsonSerializer.Serialize(dto.Options),
                CorrectAnswer = dto.CorrectAnswer,
                Explanation = dto.Explanation,
                Exam = dto.Exam,
                CreatedBy = userEmail,
                Status = status
            };

            _db.Questions.Add(question);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Question added successfully", id = question.Id });
        }

        // 🔒 Bulk upload questions
        [HttpPost("questions/bulk")]
        [Authorize(Roles = "Admin,teacher")]
        public async Task<IActionResult> BulkUploadQuestions([FromBody] List<QuestionDto> dtos)
        {
            if (dtos == null || dtos.Count == 0)
            {
                return BadRequest(new { message = "Questions list cannot be empty" });
            }

            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name) ?? "System";
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var status = "Pending";

            var list = dtos.Select(dto => new Question
            {
                AccessLevel = dto.AccessLevel ?? "Free",
                Category = dto.Category,
                Subject = dto.Subject,
                Text = dto.Text,
                OptionsJson = JsonSerializer.Serialize(dto.Options),
                CorrectAnswer = dto.CorrectAnswer,
                Explanation = dto.Explanation,
                Exam = dto.Exam,
                CreatedBy = userEmail,
                Status = status
            }).ToList();

            _db.Questions.AddRange(list);
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Successfully uploaded {list.Count} questions" });
        }

        // 🔒 Edit question (Admin or Teacher who uploaded it)
        [HttpPut("questions/{id}")]
        [Authorize(Roles = "Admin,teacher")]
        public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] QuestionDto dto)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
            {
                return NotFound(new { message = "Question not found" });
            }

            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name) ?? "System";
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && question.CreatedBy != userEmail)
            {
                return Forbid();
            }

            // If the question is already approved/live (or pending edit/delete), create a separate draft
            if (question.Status == "Approved" || question.Status == "Approved_PendingEdit" || question.Status == "Approved_PendingDelete")
            {
                // Create a draft question row
                var draft = new Question
                {
                    AccessLevel = dto.AccessLevel ?? "Free",
                    Category = dto.Category,
                    Subject = dto.Subject,
                    Text = dto.Text,
                    OptionsJson = JsonSerializer.Serialize(dto.Options),
                    CorrectAnswer = dto.CorrectAnswer,
                    Explanation = dto.Explanation,
                    Exam = dto.Exam,
                    CreatedBy = userEmail,
                    Status = "PendingEdit",
                    CorrectionComment = $"OriginalId:{question.Id}"
                };

                _db.Questions.Add(draft);
                question.Status = "Approved_PendingEdit";
                question.SetUpdated();
                await _db.SaveChangesAsync();

                return Ok(new { message = "Edit request submitted for approval. The current live version remains unchanged." });
            }
            else
            {
                // For pending/correction questions, modify them in-place
                question.AccessLevel = dto.AccessLevel ?? "Free";
                question.Category = dto.Category;
                question.Subject = dto.Subject;
                question.Text = dto.Text;
                question.OptionsJson = JsonSerializer.Serialize(dto.Options);
                question.CorrectAnswer = dto.CorrectAnswer;
                question.Explanation = dto.Explanation;
                question.Exam = dto.Exam;

                question.Status = "Pending";
                question.ApprovedBy = null;
                question.CorrectionComment = null;
                question.SetUpdated();

                await _db.SaveChangesAsync();
                return Ok(new { message = "Question details updated successfully." });
            }
        }

        // 🔒 Delete question (Admin or Teacher who uploaded it)
        [HttpDelete("questions/{id}")]
        [Authorize(Roles = "Admin,teacher")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
            {
                return NotFound(new { message = "Question not found" });
            }

            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name) ?? "System";
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && question.CreatedBy != userEmail)
            {
                return Forbid();
            }

            // If the question is live, change its status to pending delete
            if (question.Status == "Approved" || question.Status == "Approved_PendingEdit" || question.Status == "Approved_PendingDelete")
            {
                question.Status = "Approved_PendingDelete";
                question.SetUpdated();
                await _db.SaveChangesAsync();
                return Ok(new { message = "Deletion request submitted for admin approval." });
            }
            else
            {
                // If it was never live, delete it directly
                _db.Questions.Remove(question);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Question deleted successfully." });
            }
        }

        // 🔒 GET: Pending review questions (Admin Only)
        [HttpGet("questions/review")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingQuestions()
        {
            var questions = await _db.Questions
                .Where(q => q.Status == "Pending" || q.Status == "CorrectionRequested" || q.Status == "PendingEdit" || q.Status == "Approved_PendingDelete")
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            var responseList = new List<object>();
            foreach (var q in questions)
            {
                object? originalQuestion = null;
                if (q.Status == "PendingEdit" && q.CorrectionComment != null && q.CorrectionComment.StartsWith("OriginalId:"))
                {
                    var origIdStr = q.CorrectionComment.Substring("OriginalId:".Length);
                    if (Guid.TryParse(origIdStr, out var origId))
                    {
                        var orig = await _db.Questions.FirstOrDefaultAsync(x => x.Id == origId);
                        if (orig != null)
                        {
                            originalQuestion = new
                            {
                                id = orig.Id,
                                accessLevel = orig.AccessLevel,
                                category = orig.Category,
                                subject = orig.Subject,
                                text = orig.Text,
                                options = JsonSerializer.Deserialize<string[]>(orig.OptionsJson),
                                correctAnswer = orig.CorrectAnswer,
                                explanation = orig.Explanation,
                                createdBy = orig.CreatedBy ?? "Teacher",
                                createdAt = orig.CreatedAt,
                                status = orig.Status
                            };
                        }
                    }
                }

                responseList.Add(new
                {
                    id = q.Id,
                    accessLevel = q.AccessLevel,
                    category = q.Category,
                    subject = q.Subject,
                    text = q.Text,
                    options = JsonSerializer.Deserialize<string[]>(q.OptionsJson),
                    correctAnswer = q.CorrectAnswer,
                    explanation = q.Explanation,
                    createdBy = q.CreatedBy ?? "Teacher",
                    createdAt = q.CreatedAt,
                    status = q.Status,
                    approvedBy = q.ApprovedBy,
                    correctionComment = q.CorrectionComment,
                    originalQuestion = originalQuestion
                });
            }

            return Ok(responseList);
        }

        // 🔒 POST: Approve Question (Admin Only)
        [HttpPost("questions/{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveQuestion(Guid id)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound("Question not found.");

            var adminEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name) ?? "Admin";

            // If it is a pending deletion request: delete the question row
            if (question.Status == "Approved_PendingDelete")
            {
                _db.Questions.Remove(question);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Question deleted from database successfully." });
            }

            // If it is a pending edit request: merge values back to original and delete draft row
            if (question.Status == "PendingEdit" && question.CorrectionComment != null && question.CorrectionComment.StartsWith("OriginalId:"))
            {
                var origIdStr = question.CorrectionComment.Substring("OriginalId:".Length);
                if (Guid.TryParse(origIdStr, out var origId))
                {
                    var orig = await _db.Questions.FirstOrDefaultAsync(x => x.Id == origId);
                    if (orig != null)
                    {
                        // Copy all properties
                        orig.AccessLevel = question.AccessLevel;
                        orig.Category = question.Category;
                        orig.Subject = question.Subject;
                        orig.Text = question.Text;
                        orig.OptionsJson = question.OptionsJson;
                        orig.CorrectAnswer = question.CorrectAnswer;
                        orig.Explanation = question.Explanation;
                        
                        orig.Status = "Approved";
                        orig.ApprovedBy = adminEmail;
                        orig.CorrectionComment = null;
                        orig.SetUpdated();
                    }
                }

                // Delete the draft row
                _db.Questions.Remove(question);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Edits approved and merged live successfully." });
            }

            // Regular new question approval
            question.Status = "Approved";
            question.ApprovedBy = adminEmail;
            question.CorrectionComment = null;
            question.SetUpdated();

            await _db.SaveChangesAsync();
            return Ok(new { message = "Question approved and published successfully." });
        }

        // 🔒 POST: Request Correction (Admin Only)
        [HttpPost("questions/{id}/request-correction")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RequestCorrection(Guid id, [FromBody] CorrectionRequestDto dto)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound("Question not found.");

            // If it is a deletion request: cancel the request and reset back to Approved
            if (question.Status == "Approved_PendingDelete")
            {
                question.Status = "Approved";
                question.CorrectionComment = null;
                question.SetUpdated();
                await _db.SaveChangesAsync();
                return Ok(new { message = "Deletion request rejected. Question remains live." });
            }

            // If it is a pending edit draft: set draft status to CorrectionRequested so creator can fix it
            if (question.Status == "PendingEdit")
            {
                question.Status = "CorrectionRequested";
                question.CorrectionComment = dto.Comment;
                question.SetUpdated();
                await _db.SaveChangesAsync();
                return Ok(new { message = "Correction request submitted on edit draft successfully." });
            }

            // Regular correction request for new uploads
            question.Status = "CorrectionRequested";
            question.CorrectionComment = dto.Comment;
            question.SetUpdated();

            await _db.SaveChangesAsync();
            return Ok(new { message = "Correction request submitted successfully." });
        }

        // 🔒 POST: Deactivate Question (Admin Only)
        [HttpPost("questions/{id}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateQuestion(Guid id)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound("Question not found.");

            question.Status = "Deactivated";
            question.SetUpdated();

            await _db.SaveChangesAsync();
            return Ok(new { message = "Question deactivated successfully." });
        }

        // 🔒 POST: Reactivate Question (Admin Only)
        [HttpPost("questions/{id}/reactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivateQuestion(Guid id)
        {
            var question = await _db.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound("Question not found.");

            question.Status = "Approved";
            question.SetUpdated();

            await _db.SaveChangesAsync();
            return Ok(new { message = "Question reactivated successfully." });
        }

        // 🔒 Submit quiz result (Updates Points and Streak)
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuizResult([FromBody] QuizSubmissionDto dto)
        {
            var result = new UserQuizResult
            {
                UserId = UserId.ToString(),
                Category = dto.Category,
                Subject = dto.Subject,
                Score = dto.Score,
                TotalQuestions = dto.TotalQuestions,
                CompletedAt = DateTimeOffset.UtcNow
            };

            _db.UserQuizResults.Add(result);

            // Update user profile streak & points
            var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (profile != null)
            {
                profile.Points += dto.Score * 10; // 10 points per correct answer
                profile.Streak += 1;             // Increment streak on completion
                profile.SetUpdated();
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Quiz score submitted successfully",
                pointsEarned = dto.Score * 10,
                newStreak = profile?.Streak ?? 0,
                newPoints = profile?.Points ?? 0
            });
        }

        [HttpGet("daily-attempts-count")]
        public async Task<IActionResult> GetDailyAttemptsCount()
        {
            var today = DateTimeOffset.UtcNow.Date;
            var count = await _db.UserQuizResults
                .Where(r => r.UserId == UserId.ToString() && r.CompletedAt >= today)
                .CountAsync();
            return Ok(new { count });
        }

        // 🔓 Public: Leaderboard
        [HttpGet("leaderboard")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLeaderboard()
        {
            var leaders = await _db.userProfiles
                .OrderByDescending(p => p.Points)
                .Take(10)
                .Select(p => new
                {
                    name = p.Name,
                    points = p.Points,
                    streak = p.Streak,
                    photoURL = p.ProfileImageUrl,
                    studentClass = p.StudentClass
                })
                .ToListAsync();

            return Ok(leaders);
        }
    }

    public class QuestionDto
    {
        public string AccessLevel { get; set; } = "Free";
        public string Category { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public string Text { get; set; } = default!;
        public string[] Options { get; set; } = default!;
        public string CorrectAnswer { get; set; } = default!;
        public string? Explanation { get; set; }
        public string? Exam { get; set; }
    }

    public class QuizSubmissionDto
    {
        public string Category { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
    }

    public class CorrectionRequestDto
    {
        public string Comment { get; set; } = default!;
    }
}
