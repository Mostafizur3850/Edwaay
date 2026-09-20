using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class OrderListItemDto
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = null!;
        public decimal GrandTotal { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public string CreatedAt { get; set; }
    }

}
