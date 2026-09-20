using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public sealed class InventoryService : IInventoryService
{
    private readonly AppDbContext _db;
    public InventoryService(AppDbContext db) => _db = db;

    public async Task<object> GetStockAsync(string productId, CancellationToken ct)
    {
        if (!Guid.TryParse(productId, out var pid))
            return new { productId, variants = Array.Empty<object>() };

        var variants = await _db.ProductVariants.AsNoTracking()
            .Where(v => v.ProductId == pid)
            .Select(v => new { v.Id, v.Sku, v.Stock, v.IsActive })
            .ToListAsync(ct);

        return new { productId = pid, variants };
    }

    public async Task<bool> AdjustStockAsync(string productId, string? variantId, int delta, string reason, CancellationToken ct)
    {
        if (!Guid.TryParse(productId, out var pid)) return false;

        Guid? vid = null;
        if (!string.IsNullOrWhiteSpace(variantId) && Guid.TryParse(variantId, out var vg)) vid = vg;

        if (vid.HasValue)
        {
            var v = await _db.ProductVariants.FirstOrDefaultAsync(x => x.Id == vid.Value && x.ProductId == pid, ct);
            if (v is null) return false;
            v.Stock += delta;
        }

        _db.InventoryTransactions.Add(new InventoryTransaction
        {
            ProductId = pid,
            VariantId = vid,
            Delta = delta,
            Reason = reason
        });

        await _db.SaveChangesAsync(ct);
        return true;
    }
}
