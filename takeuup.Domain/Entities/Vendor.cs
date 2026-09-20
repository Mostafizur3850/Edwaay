using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Vendor : BaseEntity
    {
        public Guid UserId { get; set; } // owner identity user
        public string StoreName { get; set; } = default!;
        public string Status { get; set; } = "Pending"; // Pending/Approved/Suspended

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
