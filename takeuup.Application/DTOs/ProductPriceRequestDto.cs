using System;

namespace ECommerce.Application.DTOs
{
    public class ProductPriceRequestCreateDto
    {
        public Guid ProductId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? GuestName { get; set; }
        public string? GuestPhone { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestAddress { get; set; }
    }

    public class ProductPriceRequestQuoteDto
    {
        public Guid RequestId { get; set; }
        public decimal Price { get; set; }
    }

    public class ProductPriceRequestDetailsDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSlug { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public Guid? UserId { get; set; }
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal? QuotedPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? GuestPhone { get; set; }
        public string? GuestAddress { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class ProductPriceRequestUpdateMessageDto
    {
        public Guid RequestId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
