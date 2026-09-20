using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Warehouse : BaseEntity
    {
        public string Name { get; set; } = default!;
    }
}
