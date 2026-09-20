// File: Controllers/Admin/AdminInventoryController.cs
using ECommerce.API.Contracts;
using ECommerce.API.Data;
using ECommerce.API.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminInventoryController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminInventoryController(AppDbContext db) => _db = db;

    public sealed record AdjustReq(Guid ProductId, Guid? VariantId, int Delta, string Reason);

    [HttpPost("adjust")]
    public async Task<ActionResult<ApiResponse<object>>> Adjust([FromBody] AdjustReq req, CancellationToken ct)
    {
        if (req.Delta == 0) return BadRequest(ApiResponses.Fail<object>("Delta cannot be 0", HttpContext.TraceIdentifier));

        // update stock on variant
        if (req.VariantId.HasValue)
        {
            var v = await _db.ProductVariants.FindAsync([req.VariantId.Value], ct);
            if (v is null) return NotFound(ApiResponses.Fail<object>("Variant not found", HttpContext.TraceIdentifier));
            v.Stock += req.Delta;
        }

        _db.InventoryTransactions.Add(new InventoryTransaction
        {
            ProductId = req.ProductId,
            VariantId = req.VariantId,
            Delta = req.Delta,
            Reason = req.Reason
        });

        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponses.NoData("Adjusted", HttpContext.TraceIdentifier));
    }
}
