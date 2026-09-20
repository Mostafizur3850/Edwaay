using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserDeliveryAddressController : ControllerBase
{
    private readonly IUserDeliveryAddressService _service;

    public UserDeliveryAddressController(IUserDeliveryAddressService service)
    {
        _service = service;
    }

    private Guid UserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ================= GET =================
    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAsync(UserId));

    // ================= UPSERT =================
    [HttpPost]
    public async Task<IActionResult> Upsert(UserDeliveryAddressUpsertDto dto)
    {
        await _service.UpsertAsync(UserId, dto);
        return NoContent();
    }

    // ================= DELETE =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(UserId, id);
        return NoContent();
    }
}
