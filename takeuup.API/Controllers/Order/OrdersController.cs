using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize]
    [HasPermission]
    public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }
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
    [AllowAnonymous]
    [HttpPost("create")]
    public async Task<IActionResult> Create(
        [FromBody] OrderCreateDto dto,
        [FromQuery] string? sessionId)
    {
        var userId = TryUserId();
        var result = await _orderService.CreateOrderAsync(
            userId,
            sessionId ?? dto.SessionId,
            dto
        );
        return Ok(result);
    }
    [HttpGet("list")]
    [Authorize]
    public async Task<IActionResult> List(string? search = null, DateTime? startDate = null,  DateTime? endDate = null)
    {
        var result = await _orderService.GetOrdersAsync( search, startDate, endDate);
        return Ok(result);
    }
    [HttpGet("userwiselist")]
    [Authorize]
    [BypassPermission]
    public async Task<IActionResult> UserWiseList(string? search = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        var userId = TryUserId();
        var result = await _orderService.GetOrdersByUserAsync(search, startDate, endDate, userId);
        return Ok(result);
    }
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var isAdmin = User.IsInRole("Admin") || User.IsInRole("LocalAdmin");
        var userId = isAdmin ? null : TryUserId();
        await _orderService.DeleteOrderAsync(id, userId);
        return NoContent(); // 204
    }
    [HttpPut("{id:guid}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(
    Guid id,
    [FromBody] OrderStatusUpdateDto dto)
    {
        var userId = TryUserId();
        await _orderService.UpdateOrderStatusAsync(id, dto.Status, userId);
        return NoContent(); // 204
    }
    [HttpGet("{id:guid}/invoice")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInvoice(Guid id)
    {
        var userId = TryUserId();
        var result = await _orderService.GetOrderInvoiceAsync(id, userId);
        return Ok(result);
    }
    [HttpPut("{id:guid}/payment-status")]
    [Authorize]
    public async Task<IActionResult> UpdatePaymentStatus(
    Guid id,
    [FromBody] PaymentStatusUpdateDto dto)
    {
        var userId = TryUserId();
        await _orderService.UpdatePaymentStatusAsync(
            id,
            dto.PaymentStatus,
            userId
        );
        return NoContent();
    }
    [AllowAnonymous]
    [HttpGet("track")]
    public async Task<IActionResult> Track(
    [FromQuery] string orderNumber,
    [FromQuery] string phone)
    {
        var order = await _orderService.TrackOrderAsync(orderNumber, phone);
        if (order == null)
            return NotFound("Order not found");
        return Ok(order);
    }
}
