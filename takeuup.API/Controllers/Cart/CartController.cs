using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/cart")]
public sealed class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    /* ================= HELPERS ================= */

    private Guid? TryUserId()
    {
        if (User?.Identity?.IsAuthenticated != true)
            return null;

        var idStr =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue("sub") ??
            User.FindFirstValue("id");

        return Guid.TryParse(idStr, out var id) ? id : null;
    }

    /* ================= GET CART ================= */
    /// <summary>
    /// Get current cart (guest or logged in)
    /// </summary>
    [HttpGet("GetCart")]
    public async Task<IActionResult> GetCart([FromQuery] string? sessionId)
    {
        var userId = TryUserId();

        var cart = await _cartService.GetAsync(userId, sessionId);

        return Ok(cart);
    }

    /* ================= ADD ITEM ================= */
    /// <summary>
    /// Add item to cart (variant-based)
    /// </summary>
    [HttpPost("AddItem")]
    public async Task<IActionResult> AddItem( [FromBody] CartItemCreateDto dto, [FromQuery] string? sessionId)
    {
        var userId = TryUserId();

        await _cartService.AddAsync(userId, sessionId, dto);

        return Ok();
    }

    /* ================= UPDATE QTY ================= */
    [HttpPut("item/{itemId:guid}")]
    public async Task<IActionResult> UpdateQty(
        Guid itemId,
        [FromBody] UpdateCartQtyDto dto)
    {
        await _cartService.UpdateQtyAsync(itemId, dto.Quantity);
        return Ok();
    }

    /* ================= REMOVE ITEM ================= */
    [HttpDelete("item/{itemId:guid}")]
    public async Task<IActionResult> RemoveItem(Guid itemId)
    {
        await _cartService.RemoveItemAsync(itemId);
        return NoContent();
    }

    /* ================= CLEAR CART ================= */
    [HttpDelete]
    public async Task<IActionResult> ClearCart([FromQuery] string? sessionId)
    {
        var userId = TryUserId();

        await _cartService.ClearAsync(userId, sessionId);

        return NoContent();
    }

    /* ================= MERGE CART ================= */
    /// <summary>
    /// Merge guest cart into user cart (after login)
    /// </summary>
    [Authorize]
    [HttpPost("merge")]
    public async Task<IActionResult> MergeCart(
        [FromBody] MergeCartDto dto)
    {
        var userId = TryUserId();
        if (!userId.HasValue)
            return Unauthorized();

        await _cartService.MergeAsync(userId.Value, dto.SessionId);

        return Ok();
    }
}


