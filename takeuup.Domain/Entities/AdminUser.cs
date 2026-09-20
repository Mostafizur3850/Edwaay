using System;

namespace ECommerce.Domain.Entities
{
    public class AdminUser : BaseEntity
    {
        public string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Department { get; set; } = default!;
        public string AccessRole { get; set; } = "Admin"; // Admin, Manager, Moderator, Support
        public bool IsActive { get; set; } = true;
        public DateTimeOffset? LastLoginAt { get; set; }
    }
}
