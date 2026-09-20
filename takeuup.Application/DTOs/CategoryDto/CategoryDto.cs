using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs.CategoryDto
{
    public class CategoryCreateUpdateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? IconUrl { get; set; }
        public bool IsHighlight { get; set; }
        public int Serial { get; set; }
        public bool IsActive { get; set; }
        public Guid? ParentCategoryId { get; set; }

        public List<string> MetaKeywords { get; set; } = new();

        public IFormFileCollection? Icon { get; set; }
    }


    public class CategoryListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string IconUrl { get; set; }
        public bool IsHighlight { get; set; }
        public bool IsActive { get; set; }
        public string Slug { get; set; }
        public int Serial { get; set; }
        public string keywordInput { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public List<string> MetaKeywords { get; set; } = new();



    }

    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }
}
