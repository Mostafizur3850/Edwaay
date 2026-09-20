using System;

namespace ECommerce.Domain.Entities
{
    public class Mentor : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Institution { get; set; } = default!;
        public string ImageUrl { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public string? Bio { get; set; }
        public double Rating { get; set; } = 0.0;
        public double BookingPrice { get; set; } = 0.0;
        public string? Email { get; set; }
        public string? UserId { get; set; }
    }
}
