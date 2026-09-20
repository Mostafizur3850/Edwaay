using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; } = default!;

        public Guid ProductId { get; set; }
        public Guid? VariantId { get; set; }

        // Snapshot fields (important for analytics like GTM)
        public string ProductName { get; set; } = default!;
        public string? Sku { get; set; }
        public string? BrandName { get; set; }
        public string? CategoryName { get; set; }

        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }
}
