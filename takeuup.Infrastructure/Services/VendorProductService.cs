using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public sealed class VendorProductService : IVendorProductService
{
    private readonly AppDbContext _db;
    public VendorProductService(AppDbContext db) => _db = db;

    public async Task<PagedResponse<ProductListItemDto>> MyListingsAsync(string vendorId, ProductQuery query, CancellationToken ct)
    {
        if (!Guid.TryParse(vendorId, out var vid))
            return new PagedResponse<ProductListItemDto>([], 1, 20, 0);

        var q = _db.Products.AsNoTracking().Where(p => p.VendorId == vid);

        var total = await q.LongCountAsync(ct);
        var page = Math.Max(1, query.Page);
        var size = Math.Clamp(query.PageSize, 1, 100);

        var items = await q
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Skip((page - 1) * size)
            .Take(size)
            .Select(p => new ProductListItemDto(
                p.Id, p.Name, p.Slug,
                p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min() ?? 0,
                p.Currency,
                p.Variants.Any(v => v.IsActive && v.Stock > 0),
                p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                p.Brand != null ? p.Brand.Name : null,
                p.Category.Name
            ))
            .ToListAsync(ct);

        return new PagedResponse<ProductListItemDto>(items, page, size, total);
    }

    public async Task<ProductDetailsDto> CreateListingAsync(string vendorId, CreateProductRequest req, CancellationToken ct)
    {
        if (!Guid.TryParse(vendorId, out var vid)) throw new ArgumentException("Invalid vendorId");

        var slug = req.Name.Trim().ToLower().Replace(" ", "-");
        if (await _db.Products.AnyAsync(p => p.Slug == slug, ct))
            slug = $"{slug}-{Guid.NewGuid().ToString("N")[..6]}";

        var p = new Product
        {
            VendorId = vid,
            Name = req.Name.Trim(),
            Slug = slug,
            Description = req.Description,
            CategoryId = req.CategoryId,
            BrandId = req.BrandId,
            Currency = req.Currency,
            IsPublished = false // vendor normally requires approval
        };

        _db.Products.Add(p);
        await _db.SaveChangesAsync(ct);

        // return minimal details
        return new ProductDetailsDto(p.Id, p.Name, p.Slug, p.Description, p.Currency, p.IsPublished,
            null, null, [], [], 0, 0);
    }

    public async Task<ProductDetailsDto?> UpdateListingAsync(string vendorId, string productId, UpdateProductRequest req, CancellationToken ct)
    {
        if (!Guid.TryParse(vendorId, out var vid)) return null;
        if (!Guid.TryParse(productId, out var pid)) return null;

        var p = await _db.Products.FirstOrDefaultAsync(x => x.Id == pid && x.VendorId == vid, ct);
        if (p is null) return null;

        p.Name = req.Name.Trim();
        p.Description = req.Description;
        p.CategoryId = req.CategoryId;
        p.BrandId = req.BrandId;
        p.Currency = req.Currency;
        // keep published false until admin approves (optional)
        p.IsPublished = req.IsPublished;

        await _db.SaveChangesAsync(ct);

        return new ProductDetailsDto(p.Id, p.Name, p.Slug, p.Description, p.Currency, p.IsPublished,
            null, null, [], [], 0, 0);
    }

    public async Task<bool> SubmitForApprovalAsync(string vendorId, string productId, CancellationToken ct)
    {
        if (!Guid.TryParse(vendorId, out var vid)) return false;
        if (!Guid.TryParse(productId, out var pid)) return false;

        var p = await _db.Products.FirstOrDefaultAsync(x => x.Id == pid && x.VendorId == vid, ct);
        if (p is null) return false;

        // Optional: set a status field e.g. p.ListingStatus = "PendingApproval"
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
