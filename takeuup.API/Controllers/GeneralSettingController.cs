using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]")]
[Authorize]
    [HasPermission]
    public class GeneralSettingController : ControllerBase
{
    private readonly IGeneralSettingService _service;
    public GeneralSettingController(IGeneralSettingService service)
    {
        _service = service;
    }
    // 🌍 Public (Frontend)
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetAsync();
        return Ok(result);
    }
    // 🔐 Admin only
    [HttpPut]
    public async Task<IActionResult> Update([FromForm] GeneralSettingUpdateDto dto)
    {
        await _service.UpdateAsync(dto);
        return NoContent(); // 204
    }
}
