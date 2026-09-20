using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HomeTopAdController : ControllerBase
{
    private readonly IHomeTopAdService _service;

    public HomeTopAdController(IHomeTopAdService service)
    {
        _service = service;
    }

    // 🌍 Public
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetAsync();
        return Ok(result);
    }

    // 🔐 Admin
    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromForm] HomeTopAdUpdateDto dto)
    {
        await _service.UpdateAsync(dto);
        return NoContent();
    }
}
