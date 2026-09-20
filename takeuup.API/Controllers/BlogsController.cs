using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/blogs")]
[Authorize]
    [HasPermission]
    public class BlogsController : ControllerBase
{
    private readonly IBlogService _service;
    public BlogsController(IBlogService service)
    {
        _service = service;
    }
    // 🔓 Public blog list
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAllAsync());
    // 🔒 Admin create blog
    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] BlogCreateUpdateDto dto, CancellationToken ct)
    {        
        await _service.CreateAsync(dto, ct);
        return Ok();
    }
    // 🔒 Admin delete blog
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(  Guid id,     [FromForm] BlogCreateUpdateDto dto,     CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return Ok();
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        return Ok(await _service.GetBySlugAsync(slug));
    }
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var data = await _service.GetAllCategoriesAsync();
        return Ok(data);
    }
    [HttpGet("category/{slug}")]
    public async Task<IActionResult> GetByCategory(string slug)
    {
        var result = await _service.GetByCategorySlugAsync(slug);
        return Ok(result);
    }
}
