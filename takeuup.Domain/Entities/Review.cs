using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Review : BaseEntity
    {   
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public Guid UserId { get; set; } // identity user
        public int Rating { get; set; }  // 1-5
        public string? Comment { get; set; }
        public bool IsApproved { get; set; } = false;
    }
}
