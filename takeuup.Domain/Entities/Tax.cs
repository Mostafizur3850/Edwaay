using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Tax : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Rate { get; set; } 
        public bool IsActive { get; set; }
    }
}
