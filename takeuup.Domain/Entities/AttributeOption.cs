using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class AttributeOption : BaseEntity
    {       
        public Guid AttributeDefinitionId { get; set; }
        public AttributeDefinition AttributeDefinition { get; set; } = default!;
        public string Value { get; set; } = default!; // e.g. Black, XL
    }
}
