using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Shipment : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; } = default!;

        public string Status { get; set; } = "NotShipped"; // NotShipped/Shipped/Delivered/Returned
        public string? Carrier { get; set; }
        public string? TrackingNumber { get; set; }

        public DateTimeOffset? ShippedAt { get; set; }
        public DateTimeOffset? DeliveredAt { get; set; }
    }
}
