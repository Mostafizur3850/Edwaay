using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class InventoryTransaction : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Guid? VariantId { get; set; }
        public Guid? WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }

        public int Delta { get; set; } // +10 add, -2 sold
        public string Reason { get; set; } = default!; // "Order", "Manual Adjust"
    }
}
