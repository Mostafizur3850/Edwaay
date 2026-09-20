using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class Coupon
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string Code { get; set; }
        public int NumberOfTimes { get; set; }
        public int UsedCount { get; set; }
        public string DiscountType { get; set; } = "Percentage";
        public decimal Discount { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
