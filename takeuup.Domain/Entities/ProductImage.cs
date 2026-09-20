using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class ProductImage : BaseEntity
    {       
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public string Url { get; set; } = default!;
        public int SortOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }
}
