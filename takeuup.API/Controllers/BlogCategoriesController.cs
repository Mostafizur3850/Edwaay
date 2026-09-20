using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/blog-categories")]
[Authorize]
    [HasPermission]
    public class BlogCategoriesController : ControllerBase
{
    private readonly IBlogCategoryService _service;
    public BlogCategoriesController(IBlogCategoryService service)
    {
        _service = service;
    }
    // 🔓 Public (for frontend dropdown, footer, blog page)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAllAsync());
    // 🔒 Admin only
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] BlogCategoryCreateDto dto, CancellationToken ct)
    {
        await _service.CreateAsync(dto, ct);
        return Ok();
    }
    [HttpPatch("{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Toggle(Guid id, CancellationToken ct)
    {
        await _service.ToggleStatusAsync(id, ct);
        return Ok();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok();
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromForm] BlogCategoryCreateDto dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return Ok();
    }
}
