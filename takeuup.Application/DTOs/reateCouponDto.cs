using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class CreateCouponDto
    {
        public string Title { get; set; }
        public string Code { get; set; }
        public int NumberOfTimes { get; set; }
        public decimal Discount { get; set; }
        public string DiscountType { get; set; } = "Percentage";
    }

    public class CouponListDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public int TimesUsed { get; set; }
        public string Discount { get; set; }
        public string Status { get; set; }
        public string DiscountType { get; set; }
    }

    public class CouponDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public int NumberOfTimes { get; set; }
        public decimal Discount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }


    public sealed class UpdateCouponDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public string Code { get; set; } = default!;
        public int NumberOfTimes { get; set; }
        public decimal Discount { get; set; }
        public string Status { get; set; } = default!;
        public string DiscountType { get; set; } = "Percentage";
    }
}
