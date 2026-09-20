using System;
using System.Collections.Generic;
using System.Linq;

namespace ECommerce.Domain.Entities
{
    public sealed class Product : BaseEntity
    {
        public Guid? VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public string PartNumber { get; set; } = default!;
        public string? Description { get; set; }

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = default!;

        public Guid? BrandId { get; set; }
        public Brand? Brand { get; set; }

        public string Currency { get; set; } = "BDT";
        public bool IsPublished { get; set; } = false;
        public string PriceStatus { get; set; } = "Visible";



        public string? ShortDescription { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? VideoLink { get; set; }

        public Guid? TaxId { get; set; }
        public Tax? Tax { get; set; }
        public ICollection<ProductTag> Tags { get; set; } = new List<ProductTag>();

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();

        public ICollection<ProductAttributeValue> Attributes { get; set; } = new List<ProductAttributeValue>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<ProductMetaKeyword> MetaKeywords { get; set; }  = new List<ProductMetaKeyword>();
        public int TotalStock => Variants.Where(v => v.IsActive).Sum(v => v.Stock);
        public bool InStock => Variants.Any(v => v.IsActive && v.Stock > 0);

        public decimal? MinActivePrice =>
            Variants.Where(v => v.IsActive).Select(v => (decimal?)v.Price).Min();

        // ✅ Stock changes should happen on Variant level (SKU)
        public void ReduceVariantStock(Guid variantId, int quantity)
        {
            if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));

            var variant = FindVariantOrThrow(variantId);

            if (!variant.IsActive)
                throw new InvalidOperationException("Variant is not active");

            variant.ReduceStock(quantity);
        }

        public void IncreaseVariantStock(Guid variantId, int quantity)
        {
            if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));

            var variant = FindVariantOrThrow(variantId);
            variant.IncreaseStock(quantity);
        }

        private ProductVariant FindVariantOrThrow(Guid variantId)
        {
            if (variantId == Guid.Empty)
                throw new ArgumentException("VariantId cannot be empty", nameof(variantId));

            var variant = Variants.FirstOrDefault(v => v.Id == variantId);
            if (variant is null)
                throw new InvalidOperationException("Variant not found");

            return variant;
        }
    }
}
