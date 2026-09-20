using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/faq-categories")]
//[Authorize(Roles = "Admin")]
[Authorize]
    [HasPermission]
    public class FaqCategoriesController : ControllerBase
{
    private readonly IFaqCategoryService _service;
    public FaqCategoriesController(IFaqCategoryService service)
    {
        _service = service;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAllAsync());
    [HttpPost]
    public async Task<IActionResult> Create(FaqCategoryCreateDto dto)
    {
        await _service.CreateAsync(dto);
        return Ok();
    }
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        await _service.ToggleStatusAsync(id);
        return Ok();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}
