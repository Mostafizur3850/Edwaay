using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
namespace ECommerce.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public sealed class CouponsController : ControllerBase
{
        private readonly ICouponService _couponService;
        public CouponsController(ICouponService couponService)
        {
            _couponService = couponService;
        }
        [HttpGet("getAll")]
        [Authorize]
        public async Task<IActionResult> GetAllCoupons(CancellationToken ct)
        {
            var coupons = await _couponService.GetAllCouponsAsync(ct);
        var result = coupons.Select(c => new CouponListDto
        {
            Id = c.Id.ToString(),
            Title = c.Title,
            Code = c.Code,
            TimesUsed = c.NumberOfTimes,
            Discount = c.Discount.ToString(), 
            Status = c.IsActive ? "Active" : "Inactive",
            DiscountType = c.DiscountType
        });
        return Ok(result);
        }
        // Create a new coupon
        [HttpPost("create")]
        public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponDto dto, CancellationToken ct)
        {
            await _couponService.CreateCouponAsync(dto, ct);
            return CreatedAtAction(nameof(GetAllCoupons), new { }, null);  
        }
        // Get coupon by code
        [HttpGet("{code}")]
        public async Task<IActionResult> GetCouponByCode(string code, CancellationToken ct)
        {
            var coupon = await _couponService.GetCouponByCodeAsync(code, ct);
            if (coupon == null)
                return NotFound("Coupon not found");
            return Ok(coupon);
        }
        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCoupon(  Guid id,    [FromBody] UpdateCouponDto dto,        CancellationToken ct)
        {
            if (id != dto.Id)
                return BadRequest("Coupon ID mismatch");
            await _couponService.UpdateCouponAsync(dto, ct);
            return Ok(new
            {
                success = true,
                message = "Coupon updated successfully"
            });
        }
    // Delete coupon
    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(Guid id, CancellationToken ct)
        {
            _couponService.DeleteCouponAsync(id);
            return NoContent();  // 204 status code
        }
    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken ct)
    {
        await _couponService.ToggleStatusAsync(id, ct);
        return Ok(new
        {
            success = true,
            message = "Coupon status updated successfully"
        });
    }
}
