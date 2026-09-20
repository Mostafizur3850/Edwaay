using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentGoalController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentGoalController(AppDbContext db)
    {
        _db = db;
    }

    public record SelectInitialGoalRequest(string UserId, Guid GoalCategoryId);
    public record RequestGoalChangeRequest(string UserId, Guid RequestedGoalCategoryId, string Reason);
    public record ReviewRequestModel(string? AdminNote);
    public record DirectSetGoalRequest(string UserId, Guid GoalCategoryId);

    private string GetFormattedGoalName(GoalCategory cat, GoalCategory? parent)
    {
        if (parent != null)
        {
            return $"{parent.Title} - {cat.Title}";
        }
        return cat.Title;
    }

    // Public/Student Endpoint: Save 1st-Time Onboarding Goal Selection
    [HttpPost("select-initial")]
    [AllowAnonymous]
    public async Task<IActionResult> SelectInitialGoal([FromBody] SelectInitialGoalRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.UserId) || req.GoalCategoryId == Guid.Empty)
            return BadRequest(new { message = "UserId and GoalCategoryId are required." });

        var category = await _db.GoalCategories.FindAsync(req.GoalCategoryId);
        if (category == null || !category.IsActive)
            return BadRequest(new { message = "Invalid or inactive Goal Category." });

        GoalCategory? parentCategory = null;
        if (category.ParentId.HasValue)
        {
            parentCategory = await _db.GoalCategories.FindAsync(category.ParentId.Value);
        }

        var fullGoalName = GetFormattedGoalName(category, parentCategory);

        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId.ToString() == req.UserId || p.Email == req.UserId);
        if (profile == null)
        {
            // If userProfile entity doesn't exist yet, search User by id or email and create profile
            Guid userGuid;
            if (Guid.TryParse(req.UserId, out userGuid))
            {
                var user = await _db.Users.FindAsync(req.UserId);
                if (user != null)
                {
                    profile = new UserProfile
                    {
                        Id = Guid.NewGuid(),
                        UserId = userGuid,
                        Email = user.Email ?? req.UserId,
                        Name = user.FullName ?? user.UserName ?? "Student",
                        PhoneNumber = user.PhoneNumber ?? "",
                        ProfileImageUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(user.FullName ?? "Student")}&background=random",
                        ActiveGoalCategoryId = category.Id,
                        ActiveGoalName = fullGoalName,
                        HasSelectedInitialGoal = true
                    };
                    _db.userProfiles.Add(profile);
                }
            }
        }
        else
        {
            profile.ActiveGoalCategoryId = category.Id;
            profile.ActiveGoalName = fullGoalName;
            profile.HasSelectedInitialGoal = true;
            profile.StudentClass = fullGoalName;
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Initial goal selected successfully.",
            activeGoalCategoryId = category.Id,
            activeGoalName = fullGoalName,
            hasSelectedInitialGoal = true
        });
    }

    // Public/Student Endpoint: Get student's current active goal & pending change request status
    [HttpGet("current/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCurrentGoal(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest(new { message = "UserId is required." });

        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId || p.Email == userId);
        
        var pendingRequest = await _db.GoalChangeRequests
            .Where(r => (r.UserId.ToString() == userId || r.StudentEmail == userId) && r.Status == "Pending")
            .OrderByDescending(r => r.CreatedAt)
            .FirstOrDefaultAsync();

        if (profile == null)
        {
            return Ok(new
            {
                hasSelectedInitialGoal = false,
                activeGoalCategoryId = (Guid?)null,
                activeGoalName = (string?)null,
                pendingChangeRequest = pendingRequest != null ? new
                {
                    pendingRequest.Id,
                    pendingRequest.RequestedGoalName,
                    pendingRequest.Reason,
                    pendingRequest.CreatedAt
                } : null
            });
        }

        return Ok(new
        {
            profile.HasSelectedInitialGoal,
            profile.ActiveGoalCategoryId,
            activeGoalName = profile.ActiveGoalName ?? profile.StudentClass,
            pendingChangeRequest = pendingRequest != null ? new
            {
                pendingRequest.Id,
                pendingRequest.RequestedGoalName,
                pendingRequest.Reason,
                pendingRequest.CreatedAt
            } : null
        });
    }

    [HttpPost("request-change")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestGoalChange([FromBody] RequestGoalChangeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.UserId) || req.UserId == "undefined" || req.UserId == "null" || req.RequestedGoalCategoryId == Guid.Empty)
            return BadRequest(new { message = "ইউজার সেশন সনাক্ত করা যায়নি। অনুগ্রহ করে পুনরায় লগইন করুন। (UserId and RequestedGoalCategoryId are required)" });

        var newCategory = await _db.GoalCategories.FindAsync(req.RequestedGoalCategoryId);
        if (newCategory == null || !newCategory.IsActive)
            return BadRequest(new { message = "Selected goal category is invalid or inactive." });

        GoalCategory? parentCategory = null;
        if (newCategory.ParentId.HasValue)
        {
            parentCategory = await _db.GoalCategories.FindAsync(newCategory.ParentId.Value);
        }
        var newGoalName = GetFormattedGoalName(newCategory, parentCategory);

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == req.UserId || u.Email == req.UserId || u.UserName == req.UserId);

        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => 
            p.UserId.ToString() == req.UserId || 
            p.Email == req.UserId || 
            (user != null && p.UserId.ToString() == user.Id) ||
            (user != null && p.Email == user.Email));

        Guid userGuid = Guid.Empty;
        if (!Guid.TryParse(req.UserId, out userGuid))
        {
            if (profile != null) userGuid = profile.UserId;
            else if (user != null && Guid.TryParse(user.Id, out var parsedUserGuid)) userGuid = parsedUserGuid;
        }

        var rawStudentName = profile?.Name ?? user?.FullName ?? user?.UserName ?? req.UserId;
        var studentName = (!string.IsNullOrWhiteSpace(rawStudentName) && rawStudentName != "Student") ? rawStudentName : (profile?.Email ?? user?.Email ?? req.UserId);
        var studentEmail = profile?.Email ?? user?.Email ?? req.UserId;

        var lastApproved = await _db.GoalChangeRequests
            .Where(r => (r.UserId == userGuid || r.StudentEmail == studentEmail) && r.Status == "Approved")
            .OrderByDescending(r => r.ReviewedAt)
            .FirstOrDefaultAsync();

        var rawCurrentGoal = profile?.ActiveGoalName ?? profile?.StudentClass ?? lastApproved?.RequestedGoalName;
        var currentGoalName = (!string.IsNullOrWhiteSpace(rawCurrentGoal) && rawCurrentGoal != "Not Set") ? rawCurrentGoal : "সাধারণ শিক্ষা (General)";
        var currentGoalId = profile?.ActiveGoalCategoryId ?? Guid.Empty;

        // Check if there is already a pending request
        var existingPending = await _db.GoalChangeRequests
            .FirstOrDefaultAsync(r => (r.UserId.ToString() == req.UserId || r.StudentEmail == req.UserId || (userGuid != Guid.Empty && r.UserId == userGuid)) && r.Status == "Pending");

        if (existingPending != null)
        {
            existingPending.RequestedGoalCategoryId = newCategory.Id;
            existingPending.RequestedGoalName = newGoalName;
            existingPending.Reason = req.Reason?.Trim() ?? "Requested goal change";
            existingPending.StudentName = studentName;
            existingPending.StudentEmail = studentEmail;
            existingPending.CurrentGoalName = currentGoalName;
            existingPending.CreatedAt = DateTimeOffset.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Goal change request updated and submitted for Admin review.",
                requestId = existingPending.Id,
                status = "Pending"
            });
        }

        var changeRequest = new GoalChangeRequest
        {
            Id = Guid.NewGuid(),
            UserId = userGuid,
            StudentName = studentName,
            StudentEmail = studentEmail,
            CurrentGoalCategoryId = currentGoalId,
            CurrentGoalName = currentGoalName,
            RequestedGoalCategoryId = newCategory.Id,
            RequestedGoalName = newGoalName,
            Reason = req.Reason?.Trim() ?? "Goal change request",
            Status = "Pending",
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.GoalChangeRequests.Add(changeRequest);
        await _db.SaveChangesAsync();

        return StatusCode(201, new
        {
            message = "Goal change request submitted successfully. Waiting for Admin approval.",
            requestId = changeRequest.Id,
            status = "Pending"
        });
    }

    // Admin Endpoint: Get all Goal Change Requests
    [HttpGet("admin/requests")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAdminRequests([FromQuery] string? status = null)
    {
        var query = _db.GoalChangeRequests.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => r.Status == status);
        }

        var rawList = await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var result = rawList.Select(r =>
        {
            var currentGoal = (!string.IsNullOrWhiteSpace(r.CurrentGoalName) && r.CurrentGoalName != "Not Set")
                ? r.CurrentGoalName
                : "সাধারণ শিক্ষা (General)";

            var sName = (!string.IsNullOrWhiteSpace(r.StudentName) && r.StudentName != "Student")
                ? r.StudentName
                : (r.StudentEmail.Contains("@") ? r.StudentEmail.Split('@')[0] : r.StudentName);

            return new
            {
                r.Id,
                r.UserId,
                StudentName = sName,
                userName = sName,
                r.StudentEmail,
                userEmail = r.StudentEmail,
                r.CurrentGoalCategoryId,
                CurrentGoalName = currentGoal,
                r.RequestedGoalCategoryId,
                r.RequestedGoalName,
                r.Reason,
                r.Status,
                r.AdminNote,
                r.ReviewedBy,
                r.ReviewedAt,
                r.CreatedAt
            };
        });

        return Ok(result);
    }

    // Admin Endpoint: Approve Goal Change Request
    [HttpPost("admin/requests/{id:guid}/approve")]
    [AllowAnonymous]
    public async Task<IActionResult> ApproveRequest(Guid id, [FromBody] ReviewRequestModel? model)
    {
        var request = await _db.GoalChangeRequests.FindAsync(id);
        if (request == null) return NotFound(new { message = "Request not found." });

        if (request.Status != "Pending")
            return BadRequest(new { message = $"Request is already {request.Status}." });

        request.Status = "Approved";
        request.AdminNote = model?.AdminNote?.Trim();
        request.ReviewedBy = User.Identity?.Name ?? "Admin";
        request.ReviewedAt = DateTimeOffset.UtcNow;

        // Update student profile active goal
        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => 
            p.UserId == request.UserId || 
            (request.UserId != Guid.Empty && p.UserId.ToString() == request.UserId.ToString()) || 
            p.Email == request.StudentEmail);

        if (profile == null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId.ToString() || u.Email == request.StudentEmail);
            profile = new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId != Guid.Empty ? request.UserId : (user != null && Guid.TryParse(user.Id, out var g) ? g : Guid.NewGuid()),
                Email = request.StudentEmail,
                Name = request.StudentName,
                PhoneNumber = user?.PhoneNumber ?? "",
                ProfileImageUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(request.StudentName)}&background=random",
                ActiveGoalCategoryId = request.RequestedGoalCategoryId,
                ActiveGoalName = request.RequestedGoalName,
                StudentClass = request.RequestedGoalName,
                HasSelectedInitialGoal = true
            };
            _db.userProfiles.Add(profile);
        }
        else
        {
            profile.ActiveGoalCategoryId = request.RequestedGoalCategoryId;
            profile.ActiveGoalName = request.RequestedGoalName;
            profile.StudentClass = request.RequestedGoalName;
            profile.HasSelectedInitialGoal = true;
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = "Goal change request approved successfully.", activeGoalName = request.RequestedGoalName });
    }

    // Admin Endpoint: Reject Goal Change Request
    [HttpPost("admin/requests/{id:guid}/reject")]
    [AllowAnonymous]
    public async Task<IActionResult> RejectRequest(Guid id, [FromBody] ReviewRequestModel? model)
    {
        var request = await _db.GoalChangeRequests.FindAsync(id);
        if (request == null) return NotFound(new { message = "Request not found." });

        if (request.Status != "Pending")
            return BadRequest(new { message = $"Request is already {request.Status}." });

        request.Status = "Rejected";
        request.AdminNote = model?.AdminNote?.Trim() ?? "Request rejected by Admin.";
        request.ReviewedBy = User.Identity?.Name ?? "Admin";
        request.ReviewedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Goal change request rejected." });
    }

    // Admin Endpoint: Direct Set Student Goal
    [HttpPost("admin/direct-set")]
    [AllowAnonymous]
    public async Task<IActionResult> DirectSetGoal([FromBody] DirectSetGoalRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.UserId) || req.GoalCategoryId == Guid.Empty)
            return BadRequest(new { message = "UserId and GoalCategoryId are required." });

        var category = await _db.GoalCategories.FindAsync(req.GoalCategoryId);
        if (category == null) return NotFound(new { message = "Goal Category not found." });

        GoalCategory? parentCategory = null;
        if (category.ParentId.HasValue)
        {
            parentCategory = await _db.GoalCategories.FindAsync(category.ParentId.Value);
        }

        var fullGoalName = GetFormattedGoalName(category, parentCategory);

        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId.ToString() == req.UserId || p.Email == req.UserId);
        if (profile != null)
        {
            profile.ActiveGoalCategoryId = category.Id;
            profile.ActiveGoalName = fullGoalName;
            profile.StudentClass = fullGoalName;
            profile.HasSelectedInitialGoal = true;
            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "Student goal updated directly by Admin.", activeGoalName = fullGoalName });
    }
}
