using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service.MaintenanceService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
[ApiController]
[Route("api/[controller]")]
[Authorize]
    [HasPermission]
    public class MaintenanceController : ControllerBase
{
    private readonly IMaintenanceService _service;
    public MaintenanceController(IMaintenanceService service)
    {
        _service = service;
    }
    // 🌍 Frontend + Admin
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAsync());
    // 🔐 Admin only
    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromForm] MaintenanceUpdateDto dto)
    {
        await _service.UpdateAsync(dto);
        return NoContent();
    }
}
