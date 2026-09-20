using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
     public class HomeSliderUpsertDto
    {
        public Guid? Id { get; set; }

        [Required]
        public int HomePosition { get; set; } // Home 1/2/3/4

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string Link { get; set; } = null!;

        public string? Details { get; set; }

        public IFormFile? BrandLogo { get; set; }
        public IFormFile? SliderImage { get; set; }

        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 1;
    }

    public class HomeSliderDto
    {
        public Guid Id { get; set; }
        public int HomePosition { get; set; }
        public string Title { get; set; } = null!;
        public string Link { get; set; } = null!;
        public string? Details { get; set; }
        public string BrandLogoUrl { get; set; } = null!;
        public string SliderImageUrl { get; set; } = null!;
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }
}
