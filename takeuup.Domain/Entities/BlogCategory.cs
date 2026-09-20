using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class BlogCategory : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public string? ImageUrl { get; set; } // 👈 NEW
        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    }
}
