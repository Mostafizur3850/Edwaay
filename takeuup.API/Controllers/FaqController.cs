using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/faqs")]
[Authorize]
    [HasPermission]
    public class FaqController : ControllerBase
{
    private readonly IFaqService _service;
    public FaqController(IFaqService service)
    {
        _service = service;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAllAsync());
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(FaqCreateUpdateDto dto)
    {
        await _service.CreateAsync(dto);
        return Ok();
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, FaqCreateUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok();
    }
    [HttpPatch("{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        await _service.ToggleStatusAsync(id);
        return Ok();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}
