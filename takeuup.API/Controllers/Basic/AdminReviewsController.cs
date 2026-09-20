using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminReviewsController : ControllerBase
{
    private readonly IReviewService _service;
    public AdminReviewsController(IReviewService service) => _service = service;

    public sealed record ApproveRequest(bool Approved);

    [HttpPatch("{reviewId}/approve")]
    public async Task<ActionResult<ApiResponse<object>>> Approve(string reviewId, [FromBody] ApproveRequest req, CancellationToken ct)
    {
        var ok = await _service.ApproveAsync(reviewId, req.Approved, ct);
        if (!ok) return NotFound(ApiResponses.Fail<object>("Review not found", traceId: HttpContext.TraceIdentifier));
        return Ok(ApiResponses.NoData("Updated", HttpContext.TraceIdentifier));
    }

    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> Delete(string reviewId, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(reviewId, ct);
        return ok ? NoContent() : NotFound();
    }
}
