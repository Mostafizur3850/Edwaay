using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public GoalCategoriesController(AppDbContext db)
    {
        _db = db;
    }

    public record CategoryDto(
        Guid Id,
        string Title,
        string? Subtitle,
        Guid? ParentId,
        string? IconUrl,
        string? IconName,
        int Sequence,
        bool IsActive,
        List<CategoryDto> SubCategories
    );

    public record UpsertGoalCategoryRequest(
        string Title,
        string? Subtitle,
        Guid? ParentId,
        string? IconUrl,
        string? IconName,
        int Sequence = 1,
        bool IsActive = true
    );

    public record ReorderItem(Guid Id, int Sequence);

    // Public Endpoint: Get active hierarchical category tree for Onboarding & Goals
    [HttpGet("tree")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActiveTree()
    {
        var allActive = await _db.GoalCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Sequence)
            .ThenBy(c => c.Title)
            .ToListAsync();

        var rootCategories = allActive
            .Where(c => c.ParentId == null)
            .Select(parent => new CategoryDto(
                parent.Id,
                parent.Title,
                parent.Subtitle,
                parent.ParentId,
                parent.IconUrl,
                parent.IconName,
                parent.Sequence,
                parent.IsActive,
                allActive
                    .Where(child => child.ParentId == parent.Id)
                    .OrderBy(child => child.Sequence)
                    .Select(child => new CategoryDto(
                        child.Id,
                        child.Title,
                        child.Subtitle,
                        child.ParentId,
                        child.IconUrl,
                        child.IconName,
                        child.Sequence,
                        child.IsActive,
                        new List<CategoryDto>()
                    )).ToList()
            ))
            .ToList();

        return Ok(rootCategories);
    }

    // Public Endpoint: Get flat active list of all leaf/selectable goal options
    [HttpGet("list")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActiveList()
    {
        var allActive = await _db.GoalCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Sequence)
            .ToListAsync();

        var result = allActive.Select(c => new
        {
            c.Id,
            c.Title,
            c.Subtitle,
            c.ParentId,
            ParentTitle = c.ParentId != null ? allActive.FirstOrDefault(p => p.Id == c.ParentId)?.Title : null,
            c.IconUrl,
            c.IconName,
            c.Sequence
        });

        return Ok(result);
    }

    // Admin Endpoint: Get all categories including inactive ones
    [HttpGet("admin/all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllAdmin()
    {
        var all = await _db.GoalCategories
            .OrderBy(c => c.Sequence)
            .ThenBy(c => c.Title)
            .ToListAsync();

        var parents = all.Where(c => c.ParentId == null).Select(p => new
        {
            p.Id,
            p.Title,
            p.Subtitle,
            p.ParentId,
            p.IconUrl,
            p.IconName,
            p.Sequence,
            p.IsActive,
            SubCategories = all.Where(s => s.ParentId == p.Id).OrderBy(s => s.Sequence).Select(s => new
            {
                s.Id,
                s.Title,
                s.Subtitle,
                s.ParentId,
                s.IconUrl,
                s.IconName,
                s.Sequence,
                s.IsActive
            }).ToList()
        });

        return Ok(parents);
    }

    // Admin Endpoint: Create Category / Subcategory
    [HttpPost("admin")]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] UpsertGoalCategoryRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { message = "Title is required." });

        var cat = new GoalCategory
        {
            Id = Guid.NewGuid(),
            Title = req.Title.Trim(),
            Subtitle = req.Subtitle?.Trim(),
            ParentId = req.ParentId,
            IconUrl = req.IconUrl?.Trim(),
            IconName = string.IsNullOrWhiteSpace(req.IconName) ? "BookOpen" : req.IconName.Trim(),
            Sequence = req.Sequence,
            IsActive = req.IsActive,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _db.GoalCategories.Add(cat);
        await _db.SaveChangesAsync();

        return StatusCode(201, cat);
    }

    // Admin Endpoint: Update Category / Subcategory
    [HttpPut("admin/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpsertGoalCategoryRequest req)
    {
        var cat = await _db.GoalCategories.FindAsync(id);
        if (cat == null) return NotFound(new { message = "Category not found." });

        cat.Title = req.Title.Trim();
        cat.Subtitle = req.Subtitle?.Trim();
        cat.ParentId = req.ParentId;
        cat.IconUrl = req.IconUrl?.Trim();
        cat.IconName = string.IsNullOrWhiteSpace(req.IconName) ? "BookOpen" : req.IconName.Trim();
        cat.Sequence = req.Sequence;
        cat.IsActive = req.IsActive;
        cat.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    // Admin Endpoint: Reorder Categories Sequence
    [HttpPost("admin/reorder")]
    [AllowAnonymous]
    public async Task<IActionResult> Reorder([FromBody] List<ReorderItem> items)
    {
        if (items == null || !items.Any()) return BadRequest(new { message = "No items provided." });

        foreach (var item in items)
        {
            var cat = await _db.GoalCategories.FindAsync(item.Id);
            if (cat != null)
            {
                cat.Sequence = item.Sequence;
                cat.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Reordered successfully." });
    }

    // Admin Endpoint: Delete Category
    [HttpDelete("admin/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> Delete(Guid id)
    {
        var cat = await _db.GoalCategories.Include(c => c.SubCategories).FirstOrDefaultAsync(c => c.Id == id);
        if (cat == null) return NotFound(new { message = "Category not found." });

        if (cat.SubCategories.Any())
        {
            _db.GoalCategories.RemoveRange(cat.SubCategories);
        }

        _db.GoalCategories.Remove(cat);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Category removed successfully." });
    }
}
