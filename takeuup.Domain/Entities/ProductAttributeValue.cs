using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class ProductAttributeValue
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public Guid AttributeDefinitionId { get; set; }
        public AttributeDefinition AttributeDefinition { get; set; } = default!;

        public Guid? AttributeOptionId { get; set; }
        public AttributeOption? AttributeOption { get; set; }

        public string? Value { get; set; }
    }
}
