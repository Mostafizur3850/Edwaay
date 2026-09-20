
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminProductImagesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminProductImagesController(AppDbContext db) => _db = db;

    public sealed record AddImageRequest(string Url, bool IsPrimary, int SortOrder);

    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> Get(Guid productId, CancellationToken ct)
    {
        var imgs = await _db.ProductImages.AsNoTracking()
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.SortOrder)
            .Select(i => new { i.Id, i.Url, i.SortOrder, i.IsPrimary })
            .ToListAsync(ct);

        return Ok(ApiResponses.Ok<object>(imgs, HttpContext.TraceIdentifier));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Add(
    Guid productId,
    [FromBody] AddImageRequest req,
    CancellationToken ct)
    {
        var exists = await _db.Products.AnyAsync(p => p.Id == productId, ct);
        if (!exists)
            return NotFound(ApiResponses.Fail<object>(
                message: "Product not found",
                errors: null,
                traceId: HttpContext.TraceIdentifier
            ));

        if (req.IsPrimary)
        {
            var currentPrimaries = await _db.ProductImages
                .Where(i => i.ProductId == productId && i.IsPrimary)
                .ToListAsync(ct);

            foreach (var x in currentPrimaries)
                x.IsPrimary = false;
        }

        var img = new ProductImage
        {
            ProductId = productId,
            Url = req.Url,
            IsPrimary = req.IsPrimary,
            SortOrder = req.SortOrder
        };

        _db.ProductImages.Add(img);
        await _db.SaveChangesAsync(ct);

        return StatusCode(201, ApiResponses.Created(
            data: new { img.Id },
            traceId: HttpContext.TraceIdentifier
        ));
    }

    [HttpDelete("{imageId:guid}")]
    public async Task<IActionResult> Delete(Guid productId, Guid imageId, CancellationToken ct)
    {
        var img = await _db.ProductImages.FirstOrDefaultAsync(i => i.ProductId == productId && i.Id == imageId, ct);
        if (img is null) return NotFound();

        _db.ProductImages.Remove(img);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
