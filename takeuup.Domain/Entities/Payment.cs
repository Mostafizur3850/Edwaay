using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Payment : BaseEntity
    {
        /* ================= RELATION ================= */

        public Guid OrderId { get; set; }
        public Order Order { get; set; } = default!;      
        public string Method { get; set; } = default!;    
        public string Status { get; set; } = "Pending";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "BDT";
        public string Gateway { get; set; } = "SSLCommerz";
        public string? TransactionId { get; set; }
        public string? GatewayPayload { get; set; }
        public string? GatewayPaymentId { get; set; }
        public string? GatewayStatus { get; set; }
        public string? GatewayResponse { get; set; }

        public DateTimeOffset? InitiatedAt { get; set; }
        public DateTimeOffset? PaidAt { get; set; }
        public DateTimeOffset? FailedAt { get; set; }
    }
}
