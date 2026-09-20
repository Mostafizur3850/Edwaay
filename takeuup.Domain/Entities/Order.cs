using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace ECommerce.Domain.Entities
{
    public sealed class Order : BaseEntity
    {
        public string OrderNumber { get; set; } = default!;   
        public Guid? UserId { get; set; }
        public string? SessionId { get; set; }  
        public string Currency { get; set; } = "BDT";
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Shipping { get; set; }
        public decimal Discount { get; set; }
        public decimal GrandTotal { get; set; }
        public string? CouponCode { get; set; }
        public string Status { get; set; } = "Pending";
        // 💳 Payment
        // COD | SSL
        public string PaymentMethod { get; set; } = "COD";
        public string PaymentStatus { get; set; } = "Pending";


        // 🔗 Relations
        public OrderAddress Address { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public Payment? Payment { get; set; }
        public Shipment? Shipment { get; set; }
    }
}

