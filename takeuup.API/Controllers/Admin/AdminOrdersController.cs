using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.DTOs;
namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminOrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminOrdersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> List([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var q = _db.Orders.AsNoTracking().OrderByDescending(o => o.CreatedAt);
        var total = await q.LongCountAsync(ct);

        var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(o => new { o.Id, o.OrderNumber, o.Status, o.GrandTotal, o.Currency, o.CreatedAt })
            .ToListAsync(ct);

        return Ok(ApiResponses.Ok<object>(new { items, page, pageSize, total }, HttpContext.TraceIdentifier));
    }

    public sealed record StatusReq(string Status);

    [HttpPatch("{orderId:guid}/status")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateStatus(
        Guid orderId,
        [FromBody] StatusReq req,
        CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object[] { orderId }, ct);
        if (order is null)
            return NotFound(ApiResponses.Fail<object>(
                message: "Order not found",
                errors: null,
                traceId: HttpContext.TraceIdentifier
            ));

        order.Status = req.Status.Trim();
        await _db.SaveChangesAsync(ct);

        return Ok(ApiResponses.NoData(
            message: "Updated",
            traceId: HttpContext.TraceIdentifier
        ));
    }
}
