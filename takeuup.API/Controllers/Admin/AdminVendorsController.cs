using ECommerce.Application.DTOs;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminVendorsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminVendorsController(AppDbContext db) => _db = db;

    public sealed record VendorStatusReq(string Status); // Approved/Suspended

    [HttpPatch("{vendorId:guid}/status")]
    public async Task<ActionResult<ApiResponse<object>>> Status(Guid vendorId, [FromBody] VendorStatusReq req, CancellationToken ct)
    {
        var v = await _db.Vendors.FindAsync([vendorId], ct);
        if (v is null) return NotFound(ApiResponses.Fail<object>("Vendor not found", HttpContext.TraceIdentifier));

        v.Status = req.Status;
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponses.NoData("Updated", HttpContext.TraceIdentifier));
    }
}
