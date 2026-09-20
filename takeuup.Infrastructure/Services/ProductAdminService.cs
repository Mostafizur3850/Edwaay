using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Services
{
    public sealed class ProductAdminService : IProductAdminService
    {
        private readonly AppDbContext _db;

        public ProductAdminService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ProductDetailsDto> CreateAsync(CreateProductRequest req, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(req.Name))
                throw new ArgumentException("Product name is required", nameof(req.Name));

            // ✅ Ensure category exists
            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId, ct);
            if (!categoryExists) throw new InvalidOperationException("Category not found");

            // ✅ Ensure brand exists (optional)
            if (req.BrandId.HasValue)
            {
                var brandExists = await _db.Brands.AnyAsync(b => b.Id == req.BrandId.Value, ct);
                if (!brandExists) throw new InvalidOperationException("Brand not found");
            }

            var slug = await GenerateUniqueSlugAsync(req.Name, ct);

            var product = new Product
            {
                Name = req.Name.Trim(),
                Slug = slug,
                Description = req.Description,
                CategoryId = req.CategoryId,
                BrandId = req.BrandId,
                Currency = string.IsNullOrWhiteSpace(req.Currency) ? "BDT" : req.Currency.Trim().ToUpperInvariant(),
                IsPublished = req.IsPublished
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync(ct);

            return await GetDetailsOrThrowAsync(product.Id, ct);
        }

        public async Task<ProductDetailsDto?> UpdateAsync(string id, UpdateProductRequest req, CancellationToken ct)
        {
            if (!Guid.TryParse(id, out var pid))
                return null;

            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == pid, ct);
            if (product is null) return null;

            // ✅ Validate foreign keys
            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId, ct);
            if (!categoryExists) throw new InvalidOperationException("Category not found");

            if (req.BrandId.HasValue)
            {
                var brandExists = await _db.Brands.AnyAsync(b => b.Id == req.BrandId.Value, ct);
                if (!brandExists) throw new InvalidOperationException("Brand not found");
            }

            // ✅ Update fields
            product.Name = req.Name.Trim();
            product.Description = req.Description;
            product.CategoryId = req.CategoryId;
            product.BrandId = req.BrandId;
            product.Currency = string.IsNullOrWhiteSpace(req.Currency) ? product.Currency : req.Currency.Trim().ToUpperInvariant();
            product.IsPublished = req.IsPublished;

            // ✅ (Optional) update slug when name changes – recommended to keep stable slug
            // If you want to auto update slug:
            // product.Slug = await GenerateUniqueSlugAsync(product.Name, ct, product.Id);

            await _db.SaveChangesAsync(ct);

            return await GetDetailsAsync(pid, ct);
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken ct)
        {
            if (!Guid.TryParse(id, out var pid))
                return false;

            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == pid, ct);
            if (product is null) return false;

            _db.Products.Remove(product);
            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> SetPublishAsync(string id, bool isPublished, CancellationToken ct)
        {
            if (!Guid.TryParse(id, out var pid))
                return false;

            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == pid, ct);
            if (product is null) return false;

            product.IsPublished = isPublished;
            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<int> BulkPublishAsync(BulkPublishRequest req, CancellationToken ct)
        {
            if (req.ProductIds is null || req.ProductIds.Count == 0)
                return 0;

            var products = await _db.Products
                .Where(p => req.ProductIds.Contains(p.Id))
                .ToListAsync(ct);

            foreach (var p in products)
                p.IsPublished = req.IsPublished;

            await _db.SaveChangesAsync(ct);
            return products.Count;
        }

        // ✅ Optional: Load details to return consistent DTO
        private async Task<ProductDetailsDto?> GetDetailsAsync(
      Guid productId,
      CancellationToken ct)
        {
            var p = await _db.Products
                .AsNoTracking()
                .Include(x => x.Brand)
                .Include(x => x.Category)
                .Include(x => x.Images)
                .Include(x => x.Variants)
                .Include(x => x.Reviews)
                .FirstOrDefaultAsync(x => x.Id == productId, ct);

            if (p is null)
                return null;

            var approvedReviews = p.Reviews
                .Where(r => r.IsApproved)
                .ToList();

            var avgRating = approvedReviews.Count == 0
                ? 0
                : approvedReviews.Average(r => r.Rating);

            var variants = p.Variants
                .Select(v => new ProductVariantDto(
                    v.Id,
                    v.Sku,
                    v.Price,
                    v.OldPrice,
                    v.Stock,
                    v.IsActive
                ))
                .ToList();

            var images = p.Images
                .OrderBy(i => i.SortOrder)
                .Select(i => new ProductImageDto(
                    i.Id,
                    i.Url,
                    i.SortOrder,
                    i.IsPrimary
                ))
                .ToList();

            return new ProductDetailsDto(
                p.Id,
                p.Name,
                p.Slug,
                p.Description,
                p.Currency,
                p.IsPublished,
                p.Brand?.Name,
                p.Category.Name,
                variants,
                images,
                avgRating,
                approvedReviews.Count
            );
        }



        private async Task<ProductDetailsDto> GetDetailsOrThrowAsync(Guid productId, CancellationToken ct)
        {
            var dto = await GetDetailsAsync(productId, ct);
            return dto ?? throw new InvalidOperationException("Product saved but could not load details.");
        }

        // ✅ Slug helpers
        private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken ct, Guid? ignoreProductId = null)
        {
            var baseSlug = Slugify(name);

            var slug = baseSlug;
            var i = 1;

            while (true)
            {
                var exists = await _db.Products.AsNoTracking()
                    .AnyAsync(p => p.Slug == slug && (ignoreProductId == null || p.Id != ignoreProductId.Value), ct);

                if (!exists) return slug;

                i++;
                slug = $"{baseSlug}-{i}";
            }
        }

        private static string Slugify(string input)
        {
            input = input.Trim().ToLowerInvariant();

            // Replace non-alphanumeric with '-'
            var chars = input.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
            var slug = new string(chars);

            while (slug.Contains("--"))
                slug = slug.Replace("--", "-");

            return slug.Trim('-');
        }
    }
}
