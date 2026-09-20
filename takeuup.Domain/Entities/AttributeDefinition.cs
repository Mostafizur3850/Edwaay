using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class AttributeDefinition : BaseEntity
    {
        public string Name { get; set; } = default!;       // e.g. Color, Size
        public bool IsVariantAttribute { get; set; } = true;
        public ICollection<AttributeOption> Options { get; set; } = new List<AttributeOption>();
    }
}
