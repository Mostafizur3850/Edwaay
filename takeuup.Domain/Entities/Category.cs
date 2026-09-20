
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{

    public class Category : BaseEntity
    {
        [Required, MaxLength(500)]
        public string Name { get; set; }

        [Required, MaxLength(500)]
        public string Slug { get; set; }

        public string? IconUrl { get; set; }

        public bool IsHighlight { get; set; }

        public int Serial { get; set; }

        public bool IsActive { get; set; }

        // FK
        public Guid? ParentId { get; set; }

        // Navigation
        public Category? Parent { get; set; }

        public ICollection<Category> Children { get; set; } = new List<Category>();

        public ICollection<CategoryMetaKeyword> MetaKeywords { get; set; } = new List<CategoryMetaKeyword>();
    }

}
