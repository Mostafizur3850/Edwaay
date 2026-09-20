using System;

namespace ECommerce.Domain.Entities
{
    public sealed class ProductVariant : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public string Sku { get; set; } = default!;
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<ProductVariantOption> Options { get; set; } = new List<ProductVariantOption>();
        public void IncreaseStock(int quantity)
        {
            if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
            Stock += quantity;
        }



        public void ReduceStock(int quantity)
        {
            if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
            if (quantity > Stock) throw new InvalidOperationException("Not enough stock");
            Stock -= quantity;
        }

        public void AdjustStock(int delta)
        {
            if (delta == 0) return;

            if (delta > 0) IncreaseStock(delta);
            else ReduceStock(Math.Abs(delta));
        }

        // optional admin set
        public void SetStock(int stock)
        {
            if (stock < 0) throw new ArgumentOutOfRangeException(nameof(stock));
            Stock = stock;
        }
    }
}
