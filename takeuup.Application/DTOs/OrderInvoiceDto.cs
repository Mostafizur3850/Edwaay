using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class OrderInvoiceDto
    {
        public Guid OrderId { get; set; }
        public string OrderNumber { get; set; }
        public string OrderDate { get; set; }
        public string IssueDate { get; set; }

        // Shop Info
        public string ShopName { get; set; }
        public string ShopAddress { get; set; }
        public string ShopPhone { get; set; }
        public string ShopEmail { get; set; }

        // Customer
        public InvoiceCustomerDto Customer { get; set; }

        // Delivery
        public InvoiceDeliveryDto Delivery { get; set; }

        // Payment
        public string PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string? TransactionId { get; set; }

        // Amount
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Shipping { get; set; }
        public decimal Discount { get; set; }
        public decimal GrandTotal { get; set; }
        public string? CouponCode { get; set; }

        public List<OrderInvoiceItemDto> Items { get; set; } = new();
    }

    public class OrderInvoiceItemDto
    {
        public string ProductName { get; set; }
        public string? Sku { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class InvoiceCustomerDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
    }

    public class InvoiceDeliveryDto
    {
        public string Name { get; set; }
        public string AddressLine { get; set; }
        public string District { get; set; }
        public string Mobile { get; set; }
        public string? Email { get; set; }
    }




    public class OrderTrackDto
    {
        public string OrderNumber { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public decimal GrandTotal { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }

}
