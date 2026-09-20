using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ECommerce.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public sealed class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    public CategoriesController(
       ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }
    #region backend part 
    [HttpGet("getAll")]
    [Authorize]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Get()
    {
        return Ok(await _categoryService.GetAllAsync());
    }
    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> Create(  [FromForm] CategoryCreateUpdateDto dto,  CancellationToken ct)
    {
        await _categoryService.CreateAsync(dto, ct);
        return Ok(ApiResponses.Ok("Category created", HttpContext.TraceIdentifier));
    }
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid id,
        [FromForm] CategoryCreateUpdateDto dto,
        CancellationToken ct)
    {
        await _categoryService.UpdateAsync(id, dto, ct);
        return Ok(ApiResponses.Ok("Category updated", HttpContext.TraceIdentifier));
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _categoryService.DeleteAsync(id);
        return Ok();
    }
    [HttpPatch("{id}/toggle-status")]
    [Authorize]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        await _categoryService.ToggleStatusAsync(id);
        return Ok();
    }
    #endregion
    #region frontend part
    [HttpGet("GetAllinHome")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllinHome()
    {
        var categories = await _categoryService.GetAllAsync();
        var random7 = categories
            .Where(x => x.IsActive && x.IsHighlight)              
            .OrderBy(x => Guid.NewGuid())        
            .Take(7)                          
            .ToList();
        return Ok(random7);
    }
    [HttpGet("GetHomeCategoryMenu")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHomeCategoryMenu()
    {
        var categories = await _categoryService.GetAllAsync();
        var random7 = categories.Where(x => x.IsActive).ToList();
        return Ok(random7);
    }
    #endregion
}
