using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CheckoutController : ControllerBase
{
    private readonly AppDbContext _db;
    public CheckoutController(AppDbContext db) => _db = db;

    private Guid? TryUserId()
    {
        var s = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(s, out var id) ? id : null;
    }

    public sealed record PlaceOrderRequest(string Currency = "BDT");

    [HttpPost("place-order")]
    public async Task<ActionResult<ApiResponse<object>>> PlaceOrder([FromQuery] string? sessionId, [FromBody] PlaceOrderRequest req, CancellationToken ct)
    {
        var uid = TryUserId();

        var cart = await _db.Carts.Include(c => c.Items)
            .FirstOrDefaultAsync(c =>
                (uid.HasValue && c.UserId == uid) ||
                (!uid.HasValue && sessionId != null && c.SessionId == sessionId), ct);

        if (cart is null || cart.Items.Count == 0)
            return BadRequest(ApiResponses.Fail<object>("Cart empty", HttpContext.TraceIdentifier));

        // Build order (snapshot)
        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
            UserId = uid,
            Currency = req.Currency,
            Status = "Pending"
        };

        // Pull product snapshots
        var productIds = cart.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _db.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);

        decimal subtotal = 0;

        foreach (var ci in cart.Items)
        {
            if (!products.TryGetValue(ci.ProductId, out var p))
                return BadRequest(ApiResponses.Fail<object>("Invalid cart items", HttpContext.TraceIdentifier));

            var vSku = ci.ProductVariantId.GetHashCode() != 0
                ? await _db.ProductVariants.Where(v => v.Id == ci.ProductVariantId).Select(v => v.Sku).FirstOrDefaultAsync(ct)
                : null;

            var line = ci.UnitPrice * ci.Quantity;
            subtotal += line;

            order.Items.Add(new OrderItem
            {
                ProductId = ci.ProductId,
                VariantId = ci.ProductVariantId,
                ProductName = p.Name,
                Sku = vSku,
                BrandName = p.Brand?.Name,
                CategoryName = p.Category.Name,
                UnitPrice = ci.UnitPrice,
                Quantity = ci.Quantity,
                LineTotal = line
            });
        }

        order.Subtotal = subtotal;
        order.Tax = 0;
        order.Shipping = 0;
        order.Discount = 0;
        order.GrandTotal = subtotal;

        _db.Orders.Add(order);

        // clear cart
        _db.CartItems.RemoveRange(cart.Items);

        await _db.SaveChangesAsync(ct);

        return StatusCode(201, ApiResponses.Created<object>(new { order.Id, order.OrderNumber }, HttpContext.TraceIdentifier));
    }
}
