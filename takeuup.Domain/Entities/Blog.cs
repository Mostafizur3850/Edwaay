using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public class Blog : BaseEntity
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;

    public Guid BlogCategoryId { get; set; }
    public BlogCategory BlogCategory { get; set; } = null!;

    public string Description { get; set; } = null!;
    public string MetaDescription { get; set; } = null!;
    public bool IsActive { get; set; } = true;

    // 🔗 Relations
    public ICollection<BlogTag> BlogTags { get; set; } = new List<BlogTag>();
    public ICollection<BlogMetaKeyword> BlogMetaKeywords { get; set; } = new List<BlogMetaKeyword>();
}
