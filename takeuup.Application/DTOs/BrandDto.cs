using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public sealed class CreateBrandDto
    {
        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public IFormFileCollection Logo { get; set; } = default!; 
    }

    public sealed class UpdateBrandDto
    {
        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public IFormFileCollection Logo { get; set; } = default!;
    }

    public sealed class BrandListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public string? LogoUrl { get; set; }
        public bool IsActive { get; set; }
    }


    public class BrandDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

}
