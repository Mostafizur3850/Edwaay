using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace ECommerce.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public sealed class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReviewsController(AppDbContext db) => _db = db;
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<Review>>>> Get(
     [FromQuery] Guid? productId, 
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 20,
     CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var q = _db.Reviews.AsNoTracking();        
        if (productId.HasValue && productId.Value != Guid.Empty)
        {
            q = q.Where(r => r.ProductId == productId.Value && r.IsApproved==true);
        }               
        var total = await q.LongCountAsync(ct);
        var items = await q.OrderByDescending(r => r.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync(ct);
        return Ok(ApiResponses.Ok(new PagedResponse<Review>(items, page, pageSize, total), HttpContext.TraceIdentifier));
    }
    public sealed record CreateReviewRequest(int Rating, string? Comment);
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Create( [FromQuery] Guid productId,  [FromBody] CreateReviewRequest req,  CancellationToken ct)
    {
        if (req.Rating is < 1 or > 5)
            return BadRequest(ApiResponses.Fail<object>("Rating must be 1-5", HttpContext.TraceIdentifier));
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var uid))
            return Unauthorized(ApiResponses.Fail<object>("Invalid user", HttpContext.TraceIdentifier));
        var exists = await _db.Products.AnyAsync(p => p.Id == productId && p.IsPublished, ct);
        if (!exists) return NotFound(ApiResponses.Fail<object>("Product not found", HttpContext.TraceIdentifier));
        var review = new Review
        {
            ProductId = productId,
            UserId = uid,
            Rating = req.Rating,
            Comment = req.Comment,
            IsApproved = false
        };
        _db.Reviews.Add(review);
        await _db.SaveChangesAsync(ct);
        return StatusCode(201, ApiResponses.Created<object>(new { review.Id }, HttpContext.TraceIdentifier));
    }
    [HttpPatch("{id:guid}/approve")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Approve(Guid id, CancellationToken ct)
    {
        var review = await _db.Reviews.FindAsync(new object[] { id }, ct);
        if (review == null)
            return NotFound(ApiResponses.Fail<object>("Review not found", HttpContext.TraceIdentifier));
        if (review.IsApproved)
            return BadRequest(ApiResponses.Fail<object>("Review is already approved", HttpContext.TraceIdentifier));
        review.IsApproved = true;
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponses.Ok<object>(new { Message = "Review approved successfully" }, HttpContext.TraceIdentifier));
    }
    [HttpDelete("{id:guid}")]
    [Authorize] 
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var review = await _db.Reviews.FindAsync(new object[] { id }, ct);
        if (review == null)
            return NotFound(ApiResponses.Fail<object>("Review not found", HttpContext.TraceIdentifier));
        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponses.Ok<object>(new { Message = "Review deleted successfully" }, HttpContext.TraceIdentifier));
    }
}
