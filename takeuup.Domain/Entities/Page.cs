using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class Page : BaseEntity
    {
        public string Title { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public string? DisplayLocation { get; set; }
        public string Details { get; set; } = default!;
        public string? MetaKeywords { get; set; }
        public string? MetaDescription { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
