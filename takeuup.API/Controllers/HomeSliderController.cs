using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using ECommerce.Application.Service.HomeSliderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]")]
[Authorize]
    [HasPermission]
    public class HomeSliderController : ControllerBase
{
    private readonly IHomeSliderService _service;
    public HomeSliderController(IHomeSliderService service)
    {
        _service = service;
    }
    // 🌍 Frontend
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAsync());
    // 🔐 Admin
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Upsert([FromForm] HomeSliderUpsertDto dto)
    {
        await _service.UpsertAsync(dto);
        return NoContent();
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
