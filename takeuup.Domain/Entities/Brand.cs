using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Brand : BaseEntity
    {
      
            public string Name { get; set; } = default!;
            public string Slug { get; set; } = default!;
            public string? LogoUrl { get; set; }
            public bool IsActive { get; set; } = true;
            public ICollection<Product> Products { get; set; } = new List<Product>();
       

    }
}
