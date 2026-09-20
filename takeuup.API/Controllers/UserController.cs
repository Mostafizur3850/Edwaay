using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
[ApiController]
[Route("api/users")]
[Authorize]
[HasPermission]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly AppDbContext _db;
    public UserController(IUserService userService, AppDbContext db)
    {
        _userService = userService;
        _db = db;
    }
    [HttpGet("GetAll")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersWithRolesAsync();
        return Ok(users);
    }
    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(UserCreateDto dto)
    {
        await _userService.CreateUserAsync(dto);
        return Ok("User created and role assigned");
    }
    [HttpGet("GetAllActiveUser")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] bool? isActive)
    {
        var users = await _userService.GetAllUsersWithRolesAsync();
        if (isActive.HasValue)
            users = users.Where(u => u.IsActive == isActive.Value).ToList();
        return Ok(users);
    }
    [HttpPatch("status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(UserStatusUpdateDto dto)
    {
        await _userService.UpdateUserStatusAsync(dto);
        return Ok($"User status updated to {(dto.IsActive ? "Active" : "Inactive")}");
    }
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(UserUpdateDto dto)
    {
        await _userService.UpdateUserAsync(dto);
        return Ok("User updated successfully");
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok("User deleted successfully");
    }

    [HttpPost("approve-teacher/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveTeacher(string id)
    {
        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId.ToString() == id);
        if (profile == null) return NotFound("User profile not found.");

        profile.IsTeacherApproved = true;
        profile.SetUpdated();

        await _db.CommitAsync();
        return Ok(new { message = "Teacher registration approved successfully." });
    }

    [HttpGet("student-details/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetStudentDetails(string id)
    {
        var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId.ToString() == id);
        if (profile == null) return NotFound("Student profile not found.");

        var quizResults = await _db.UserQuizResults
            .Where(r => r.UserId == id)
            .OrderByDescending(r => r.CompletedAt)
            .ToListAsync();

        var payments = await _db.Payments
            .Include(p => p.Order)
            .Where(p => p.Order.UserId == Guid.Parse(id))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(new
        {
            profile = new
            {
                name = profile.Name,
                email = profile.Email,
                phoneNumber = profile.PhoneNumber,
                streak = profile.Streak,
                points = profile.Points,
                studentClass = profile.StudentClass,
                profileImageUrl = profile.ProfileImageUrl,
                createdAt = profile.CreatedAt
            },
            activities = quizResults.Select(r => new
            {
                id = r.Id,
                category = r.Category,
                subject = r.Subject,
                score = r.Score,
                totalQuestions = r.TotalQuestions,
                completedAt = r.CompletedAt
            }),
            payments = payments.Select(p => new
            {
                id = p.Id,
                amount = p.Amount,
                paymentMethod = p.Method,
                status = p.Status,
                createdAt = p.CreatedAt,
                transactionId = p.TransactionId
            })
        });
    }
}
