using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class PaymentTransaction : BaseEntity
    {
        public Guid PaymentId { get; set; }
        public Payment Payment { get; set; } = default!;
        public string Provider { get; set; } = "SSLCommerz";
        public string TransactionId { get; set; } = default!;
        public string Status { get; set; } = "Initiated";    

        public decimal Amount { get; set; }
        public string Currency { get; set; } = "BDT";

        public string? Response { get; set; }
    }
}
