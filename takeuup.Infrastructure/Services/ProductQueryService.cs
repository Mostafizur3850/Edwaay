using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.Infrastructure.Services;
public sealed class ProductQueryService : IProductQueryService
{
    private readonly AppDbContext _db;

    public ProductQueryService(AppDbContext db) => _db = db;

    public async Task<PagedResponse<ProductListItemDto>> SearchAsync(ProductQuery query, CancellationToken ct)
    {
        var q = _db.Products.AsNoTracking()
            .Where(p => p.IsPublished);

        if (!string.IsNullOrWhiteSpace(query.Q))
            q = q.Where(p => EF.Functions.Like(p.Name, $"%{query.Q}%"));

        if (query.CategoryId.HasValue)
            q = q.Where(p => p.CategoryId == query.CategoryId.Value);

        if (query.BrandId.HasValue)
            q = q.Where(p => p.BrandId == query.BrandId.Value);

        if (query.InStock.HasValue)
        {
            if (query.InStock.Value)
                q = q.Where(p => p.Variants.Any(v => v.IsActive && v.Stock > 0));
            else
                q = q.Where(p => !p.Variants.Any(v => v.IsActive && v.Stock > 0));
        }

        if (query.MinPrice.HasValue)
            q = q.Where(p => p.Variants.Any(v => v.IsActive && v.Price >= query.MinPrice.Value));

        if (query.MaxPrice.HasValue)
            q = q.Where(p => p.Variants.Any(v => v.IsActive && v.Price <= query.MaxPrice.Value));

        q = query.Sort switch
        {
            "newest" => q.OrderByDescending(p => p.CreatedAt),
            "price_asc" => q.OrderBy(p => p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min() ?? 0),
            "price_desc" => q.OrderByDescending(p => p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min() ?? 0),
            _ => q.OrderBy(p => p.Name)
        };

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
                p.Id,
                p.Name,
                p.Slug,
                p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min() ?? 0,
                p.Currency,
                p.Variants.Any(v => v.IsActive && v.Stock > 0),
                p.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsPrimary) != null
                    ? p.Images.OrderBy(i => i.SortOrder).First(i => i.IsPrimary).Url
                    : p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                p.Brand != null ? p.Brand.Name : null,
                p.Category.Name
            ))
            .ToListAsync(ct);

        return new PagedResponse<ProductListItemDto>(items, page, size, total);
    }

    public async Task<ProductDetailsDto?> GetByIdOrSlugAsync(
    string idOrSlug,
    CancellationToken ct)
    {
        var product = await _db.Products
            .AsNoTracking()
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p =>
                p.IsPublished &&
                (p.Slug == idOrSlug || p.Id.ToString() == idOrSlug),
                ct);

        if (product is null)
            return null;

        var approvedReviews = product.Reviews
            .Where(r => r.IsApproved)
            .ToList();

        var avgRating = approvedReviews.Count == 0
            ? 0
            : approvedReviews.Average(r => r.Rating);

        var variants = product.Variants
            .Select(v => new ProductVariantDto(
                v.Id,
                v.Sku,
                v.Price,
                v.OldPrice,   // ✅ correct
                v.Stock,      // ✅ correct
                v.IsActive    // ✅ correct
            ))
            .ToList();

        var images = product.Images
            .OrderBy(i => i.SortOrder)
            .Select(i => new ProductImageDto(
                i.Id,
                i.Url,
                i.SortOrder,
                i.IsPrimary
            ))
            .ToList();

        return new ProductDetailsDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.Currency,
            product.IsPublished,
            product.Brand?.Name,
            product.Category.Name,
            variants,
            images,
            avgRating,
            approvedReviews.Count
        );
    }

    public async Task<ProductFiltersDto> GetFiltersAsync(ProductQuery query, CancellationToken ct)
    {
        // Facets: categories, brands, min/max price for current query scope
        var baseQ = _db.Products.AsNoTracking().Where(p => p.IsPublished);

        if (!string.IsNullOrWhiteSpace(query.Q))
            baseQ = baseQ.Where(p => EF.Functions.Like(p.Name, $"%{query.Q}%"));

        var categories = await baseQ
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c.Name)
            .Select(c => new IdNameDto(c.Id.ToString(), c.Name))
            .ToListAsync(ct);

        var brands = await baseQ
            .Where(p => p.Brand != null)
            .Select(p => p.Brand!)
            .Distinct()
            .OrderBy(b => b.Name)
            .Select(b => new IdNameDto(b.Id.ToString(), b.Name))
            .ToListAsync(ct);

        var minPrice = await baseQ
            .SelectMany(p => p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price))
            .MinAsync(ct);

        var maxPrice = await baseQ
            .SelectMany(p => p.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price))
            .MaxAsync(ct);

        return new ProductFiltersDto(categories, brands, minPrice, maxPrice);
    }

    public async Task<IReadOnlyList<ProductListItemDto>> GetRelatedAsync(string productId, int take, CancellationToken ct)
    {
        if (!Guid.TryParse(productId, out var id)) return [];

        var p = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        if (p is null) return [];

        take = Math.Clamp(take, 1, 50);

        var related = await _db.Products.AsNoTracking()
            .Where(x => x.IsPublished && x.Id != id && x.CategoryId == p.CategoryId)
            .Include(x => x.Brand)
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.Variants)
            .OrderByDescending(x => x.CreatedAt)
            .Take(take)
            .Select(x => new ProductListItemDto(
                x.Id, x.Name, x.Slug,
                x.Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min() ?? 0,
                x.Currency,
                x.Variants.Any(v => v.IsActive && v.Stock > 0),
                x.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsPrimary) != null
                    ? x.Images.OrderBy(i => i.SortOrder).First(i => i.IsPrimary).Url
                    : x.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                x.Brand != null ? x.Brand.Name : null,
                x.Category.Name
            ))
            .ToListAsync(ct);

        return related;
    }
}
