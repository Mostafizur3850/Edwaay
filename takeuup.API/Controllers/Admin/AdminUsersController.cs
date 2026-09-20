using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminUsersController(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    public record CreateAdminUserRequest(
        string Username,
        string Email,
        string Password,
        string FullName,
        string Department,
        string AccessRole = "Admin"
    );

    public record UpdateAdminUserRequest(
        string FullName,
        string Department,
        string AccessRole,
        bool IsActive,
        string? NewPassword = null
    );

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var admins = await _db.AdminUsers
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.Username,
                a.Email,
                a.FullName,
                a.Department,
                a.AccessRole,
                a.IsActive,
                a.LastLoginAt,
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(admins);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var admin = await _db.AdminUsers.FindAsync(id);
        if (admin == null) return NotFound(new { message = "Admin user not found." });

        return Ok(new
        {
            admin.Id,
            admin.Username,
            admin.Email,
            admin.FullName,
            admin.Department,
            admin.AccessRole,
            admin.IsActive,
            admin.LastLoginAt,
            admin.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdminUserRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and Password are required." });

        var username = string.IsNullOrWhiteSpace(req.Username) ? req.Email.Trim() : req.Username.Trim();
        var email = req.Email.Trim();

        var existingAdmin = await _db.AdminUsers.FirstOrDefaultAsync(a => a.Email == email || a.Username == username);
        if (existingAdmin != null)
            return BadRequest(new { message = "An Admin user with this Email or Username already exists." });

        var hasher = new PasswordHasher<AdminUser>();
        var adminEntity = new AdminUser
        {
            Id = Guid.NewGuid(),
            Username = username,
            Email = email,
            FullName = req.FullName?.Trim() ?? username,
            Department = req.Department?.Trim() ?? "General",
            AccessRole = string.IsNullOrWhiteSpace(req.AccessRole) ? "Admin" : req.AccessRole.Trim(),
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
        adminEntity.PasswordHash = hasher.HashPassword(adminEntity, req.Password);

        _db.AdminUsers.Add(adminEntity);
        await _db.SaveChangesAsync();

        // Sync with AspNetUsers Identity
        var appUser = await _userManager.FindByEmailAsync(email) ?? await _userManager.FindByNameAsync(username);
        if (appUser == null)
        {
            appUser = new ApplicationUser
            {
                UserName = username,
                Email = email,
                EmailConfirmed = true,
                FullName = adminEntity.FullName,
                IsActive = true
            };
            var createRes = await _userManager.CreateAsync(appUser, req.Password);
            if (createRes.Succeeded)
            {
                await _userManager.AddToRoleAsync(appUser, "Admin");
            }
        }
        else
        {
            if (!await _userManager.IsInRoleAsync(appUser, "Admin"))
            {
                await _userManager.AddToRoleAsync(appUser, "Admin");
            }
        }

        return CreatedAtAction(nameof(GetById), new { id = adminEntity.Id }, new
        {
            adminEntity.Id,
            adminEntity.Username,
            adminEntity.Email,
            adminEntity.FullName,
            adminEntity.Department,
            adminEntity.AccessRole,
            adminEntity.IsActive,
            adminEntity.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAdminUserRequest req)
    {
        var admin = await _db.AdminUsers.FindAsync(id);
        if (admin == null) return NotFound(new { message = "Admin user not found." });

        admin.FullName = string.IsNullOrWhiteSpace(req.FullName) ? admin.FullName : req.FullName.Trim();
        admin.Department = string.IsNullOrWhiteSpace(req.Department) ? admin.Department : req.Department.Trim();
        admin.AccessRole = string.IsNullOrWhiteSpace(req.AccessRole) ? admin.AccessRole : req.AccessRole.Trim();
        admin.IsActive = req.IsActive;
        admin.UpdatedAt = DateTimeOffset.UtcNow;

        if (!string.IsNullOrWhiteSpace(req.NewPassword))
        {
            var hasher = new PasswordHasher<AdminUser>();
            admin.PasswordHash = hasher.HashPassword(admin, req.NewPassword);

            var appUser = await _userManager.FindByEmailAsync(admin.Email) ?? await _userManager.FindByNameAsync(admin.Username);
            if (appUser != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(appUser);
                await _userManager.ResetPasswordAsync(appUser, token, req.NewPassword);
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Admin user updated successfully." });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var admin = await _db.AdminUsers.FindAsync(id);
        if (admin == null) return NotFound(new { message = "Admin user not found." });

        _db.AdminUsers.Remove(admin);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Admin user removed successfully." });
    }
}
