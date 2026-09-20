using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminProductVariantsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminProductVariantsController(AppDbContext db) => _db = db;

    public sealed record UpsertVariantRequest(string Sku, decimal Price, int Stock, bool IsActive, IDictionary<Guid, Guid?> Options, IDictionary<Guid, string?> CustomValues);

    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> Get(Guid productId, CancellationToken ct)
    {
        var variants = await _db.ProductVariants.AsNoTracking()
            .Include(v => v.Options).ThenInclude(o => o.AttributeDefinition)
            .Include(v => v.Options).ThenInclude(o => o.AttributeOption)
            .Where(v => v.ProductId == productId)
            .Select(v => new
            {
                v.Id,
                v.Sku,
                v.Price,
                v.Stock,
                v.IsActive,
                Options = v.Options.ToDictionary(
                    x => x.AttributeDefinition.Name,
                    x => x.AttributeOption != null ? x.AttributeOption.Value : (x.CustomValue ?? "")
                )
            })
            .ToListAsync(ct);

        return Ok(ApiResponses.Ok<object>(variants, HttpContext.TraceIdentifier));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Create(Guid productId, [FromBody] UpsertVariantRequest req, CancellationToken ct)
    {
        var exists = await _db.Products.AnyAsync(p => p.Id == productId, ct);
        if (!exists) return NotFound(ApiResponses.Fail<object>("Product not found", HttpContext.TraceIdentifier));

        var variant = new ProductVariant
        {
            ProductId = productId,
            Sku = req.Sku,
            Price = req.Price,
            Stock = req.Stock,
            IsActive = req.IsActive
        };

        // req.Options: key=AttributeDefinitionId, value=AttributeOptionId
        foreach (var kv in req.Options)
        {
            var attrDefId = kv.Key;
            var optId = kv.Value;

            variant.Options.Add(new ProductVariantOption
            {
                VariantId = variant.Id,
                AttributeDefinitionId = attrDefId,
                AttributeOptionId = optId,
                CustomValue = req.CustomValues.TryGetValue(attrDefId, out var cv) ? cv : null
            });
        }

        _db.ProductVariants.Add(variant);
        await _db.SaveChangesAsync(ct);

        return StatusCode(201, ApiResponses.Created<object>(new { variant.Id }, HttpContext.TraceIdentifier));
    }

    [HttpDelete("{variantId:guid}")]
    public async Task<IActionResult> Delete(Guid productId, Guid variantId, CancellationToken ct)
    {
        var v = await _db.ProductVariants.FirstOrDefaultAsync(x => x.ProductId == productId && x.Id == variantId, ct);
        if (v is null) return NotFound();

        _db.ProductVariants.Remove(v);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
