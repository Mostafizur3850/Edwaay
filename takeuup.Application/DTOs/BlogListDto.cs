using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class BlogListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public Guid BlogCategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string Slug { get; set; }   // ✅ ADD THIS



    }



    public class BlogCreateUpdateDto
    {
        public string Title { get; set; } = null!;
        public Guid BlogCategoryId { get; set; }
        public string Description { get; set; } = null!;
        public string MetaDescription { get; set; } = null!;
        public bool IsActive { get; set; }

        public IFormFileCollection? Image { get; set; }
        public List<string>? Tags { get; set; }
        public List<string>? MetaKeywords { get; set; }
    }


    public class BlogDetailsDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid BlogCategoryId { get; set; }
        public string Description { get; set; }
        public string MetaDescription { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Tags { get; set; }
        public List<string> MetaKeywords { get; set; }
    }


    public class BlogCategoryDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Slug { get; set; }

        public bool IsActive { get; set; }
    }


}
