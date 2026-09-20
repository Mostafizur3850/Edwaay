using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Cart : BaseEntity
    {
        public Guid? UserId { get; set; }   // logged-in
        public string? SessionId { get; set; } // guest cart
        public string Currency { get; set; } = "BDT";

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
