using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomeSlider : BaseEntity
    {
        public int HomePosition { get; set; } // 1,2,3,4

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        public string Link { get; set; } = null!;

        public string? Details { get; set; }

        [Required]
        public string BrandLogoUrl { get; set; } = null!;

        [Required]
        public string SliderImageUrl { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 1;
    }

}
