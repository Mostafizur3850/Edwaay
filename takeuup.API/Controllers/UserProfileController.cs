using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileService _service;

    public UserProfileController(IUserProfileService service)
    {
        _service = service;
    }

    private Guid UserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ================= GET =================
    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _service.GetAsync(UserId));

    // ================= GET LEADERBOARD =================
    [HttpGet("leaderboard")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLeaderboard()
        => Ok(await _service.GetLeaderboardAsync());

    // ================= UPSERT =================
    [HttpPost]
    public async Task<IActionResult> Upsert([FromForm] UserProfileUpsertDto dto)
    {
        await _service.UpsertAsync(UserId, dto);
        return NoContent();
    }
}
