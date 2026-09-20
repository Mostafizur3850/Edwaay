using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class ProductVariantOption
    {
        public Guid VariantId { get; set; }
        public ProductVariant Variant { get; set; } = default!;

        public Guid AttributeDefinitionId { get; set; }
        public AttributeDefinition AttributeDefinition { get; set; } = default!;

        public Guid? AttributeOptionId { get; set; }   // predefined option
        public AttributeOption? AttributeOption { get; set; }

        public string? CustomValue { get; set; }       // fallback value
    }
}
