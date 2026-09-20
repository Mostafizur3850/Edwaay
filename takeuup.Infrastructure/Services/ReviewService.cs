using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public sealed class ReviewService : IReviewService
{
    private readonly AppDbContext _db;
    public ReviewService(AppDbContext db) => _db = db;

    public async Task<PagedResponse<object>> GetByProductAsync(string productId, int page, int pageSize, CancellationToken ct)
    {
        if (!Guid.TryParse(productId, out var pid))
            return new PagedResponse<object>([], 1, 20, 0);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var q = _db.Reviews.AsNoTracking()
            .Where(r => r.ProductId == pid && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt);

        var total = await q.LongCountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new { r.Id, r.Rating, r.Comment, r.CreatedAt })
            .ToListAsync(ct);

        return new PagedResponse<object>(items, page, pageSize, total);
    }

    public async Task<object> CreateAsync(string productId, int rating, string? comment, CancellationToken ct)
    {
        if (!Guid.TryParse(productId, out var pid))
            throw new ArgumentException("Invalid productId");

        var exists = await _db.Products.AnyAsync(p => p.Id == pid && p.IsPublished, ct);
        if (!exists) throw new InvalidOperationException("Product not found");

        // userId you will pass from controller/service layer (simplified = Guid.Empty)
        var review = new Review
        {
            ProductId = pid,
            UserId = Guid.Empty,
            Rating = rating,
            Comment = comment,
            IsApproved = false
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync(ct);

        return new { review.Id };
    }

    public async Task<bool> DeleteAsync(string reviewId, CancellationToken ct)
    {
        if (!Guid.TryParse(reviewId, out var rid)) return false;
        var r = await _db.Reviews.FirstOrDefaultAsync(x => x.Id == rid, ct);
        if (r is null) return false;
        _db.Reviews.Remove(r);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ApproveAsync(string reviewId, bool approved, CancellationToken ct)
    {
        if (!Guid.TryParse(reviewId, out var rid)) return false;
        var r = await _db.Reviews.FirstOrDefaultAsync(x => x.Id == rid, ct);
        if (r is null) return false;
        r.IsApproved = approved;
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
