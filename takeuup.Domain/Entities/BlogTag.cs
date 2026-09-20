using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class BlogTag : BaseEntity
    {
        public Guid BlogId { get; set; }
        public Blog Blog { get; set; } = null!;
        public string Name { get; set; } = default!;
    }
}
