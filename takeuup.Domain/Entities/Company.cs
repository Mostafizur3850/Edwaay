using System;

namespace ECommerce.Domain.Entities
{
    public class Company : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? Logo { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? UserId { get; set; }
    }
}
