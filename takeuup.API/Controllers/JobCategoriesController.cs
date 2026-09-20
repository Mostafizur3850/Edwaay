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
    public class JobCategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobCategoriesController(AppDbContext db)
        {
            _db = db;
        }

        // 🔓 Public: Get all active categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.JobCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }

        // 🔒 Admin: Get all categories (including inactive)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminCategories()
        {
            var categories = await _db.JobCategories
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }

        // 🔒 Admin: Create category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] JobCategoryUpsertDto dto)
        {
            var slug = dto.Name.ToLower().Replace(" ", "-").Replace("&", "and");
            var category = new JobCategory
            {
                Name = dto.Name,
                Slug = slug,
                IsActive = dto.IsActive
            };

            _db.JobCategories.Add(category);
            await _db.SaveChangesAsync();

            return Ok(category);
        }

        // 🔒 Admin: Update category
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] JobCategoryUpsertDto dto)
        {
            var category = await _db.JobCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found");

            category.Name = dto.Name;
            category.Slug = dto.Name.ToLower().Replace(" ", "-").Replace("&", "and");
            category.IsActive = dto.IsActive;

            category.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(category);
        }

        // 🔒 Admin: Delete category
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _db.JobCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found");

            _db.JobCategories.Remove(category);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
    }

    public class JobCategoryUpsertDto
    {
        public string Name { get; set; } = default!;
        public bool IsActive { get; set; } = true;
    }
}
