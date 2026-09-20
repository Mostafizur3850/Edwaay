using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class BlogCategoryListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class BlogCategoryDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class BlogCategoryCreateDto
    {
        public string Name { get; set; }
        public IFormFileCollection? Image { get; set; }
    }




}
