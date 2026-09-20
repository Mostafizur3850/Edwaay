using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class ProductMetaKeyword
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }

        public string Keyword { get; set; } = default!;

        public Product Product { get; set; } = default!;
    }
}
