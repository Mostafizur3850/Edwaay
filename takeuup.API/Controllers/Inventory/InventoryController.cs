using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;
    public InventoryController(IInventoryService service) => _service = service;

    public sealed record StockAdjustRequest(string? VariantId, int Delta, string Reason);

    [HttpGet("products/{productId}")]
    public async Task<ActionResult<ApiResponse<object>>> GetStock(string productId, CancellationToken ct)
    {
        var stock = await _service.GetStockAsync(productId, ct);
        return Ok(ApiResponses.Ok(stock, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("products/{productId}/adjust")]
    public async Task<ActionResult<ApiResponse<object>>> Adjust(string productId, [FromBody] StockAdjustRequest req, CancellationToken ct)
    {
        if (req.Delta == 0) return BadRequest(ApiResponses.Fail<object>("Delta cannot be 0", traceId: HttpContext.TraceIdentifier));
        if (string.IsNullOrWhiteSpace(req.Reason)) return BadRequest(ApiResponses.Fail<object>("Reason is required", traceId: HttpContext.TraceIdentifier));

        var ok = await _service.AdjustStockAsync(productId, req.VariantId, req.Delta, req.Reason, ct);
        if (!ok) return NotFound(ApiResponses.Fail<object>("Product/Variant not found", traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponses.NoData("Stock adjusted", HttpContext.TraceIdentifier));
    }
}
