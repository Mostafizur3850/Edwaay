using System;

namespace ECommerce.Domain.Entities
{
    public class AboutUsMember : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string Bio { get; set; } = default!;
        public string ImageUrl { get; set; } = default!;
        public int DisplayOrder { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? Email { get; set; }
    }
}
