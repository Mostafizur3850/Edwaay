using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class ProductPriceRequestController : ControllerBase
    {
        private readonly IProductPriceRequestService _priceRequestService;

        public ProductPriceRequestController(IProductPriceRequestService priceRequestService)
        {
            _priceRequestService = priceRequestService;
        }

        [HttpPost("request-price")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestPrice([FromBody] ProductPriceRequestCreateDto dto)
        {
            Guid? userId = null;
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdStr) && Guid.TryParse(userIdStr, out var parsedId))
            {
                userId = parsedId;
            }

            if (!userId.HasValue)
            {
                if (string.IsNullOrWhiteSpace(dto.GuestName) ||
                    string.IsNullOrWhiteSpace(dto.GuestPhone) ||
                    string.IsNullOrWhiteSpace(dto.GuestEmail) ||
                    string.IsNullOrWhiteSpace(dto.GuestAddress))
                {
                    return BadRequest(new { message = "Guest requests must include Name, Contact No, Email, and Address." });
                }
            }

            await _priceRequestService.CreateRequestAsync(
                dto.ProductId, 
                userId, 
                dto.Message, 
                dto.GuestName, 
                dto.GuestPhone, 
                dto.GuestEmail, 
                dto.GuestAddress
            );

            return Ok(new { success = true, message = "Price request submitted successfully." });
        }

        [HttpGet("admin/list")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRequestsForAdmin()
        {
            var requests = await _priceRequestService.GetRequestsForAdminAsync();
            return Ok(requests);
        }

        [HttpPost("admin/quote")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> QuotePrice([FromBody] ProductPriceRequestQuoteDto dto)
        {
            await _priceRequestService.QuotePriceAsync(dto.RequestId, dto.Price);
            return Ok(new { success = true, message = "Price quote submitted successfully." });
        }

        [HttpGet("my-requests")]
        [Authorize]
        public async Task<IActionResult> GetMyRequests()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "User not logged in." });
            }

            var requests = await _priceRequestService.GetRequestsForUserAsync(userId);
            return Ok(requests);
        }

        [HttpPost("update-message")]
        [Authorize]
        public async Task<IActionResult> UpdateMessage([FromBody] ProductPriceRequestUpdateMessageDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "User not logged in." });
            }

            await _priceRequestService.UpdateRequestMessageAsync(dto.RequestId, userId, dto.Message);
            return Ok(new { success = true, message = "Price request message updated successfully." });
        }
    }
}
