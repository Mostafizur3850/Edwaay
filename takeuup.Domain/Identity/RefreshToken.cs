using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = default!;
        public DateTime ExpiresAtUtc { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? RevokedAtUtc { get; set; }
        public bool IsRevoked => RevokedAtUtc != null;
        public bool IsExpired => DateTime.UtcNow >= ExpiresAtUtc;
        public string UserId { get; set; } = default!;
        public ApplicationUser User { get; set; } = default!;
    }
}
