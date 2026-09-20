using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class ProductTag : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public string Name { get; set; } = default!;
    }
}
