using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomeHeroBanner : BaseEntity
    {
        public string ImageUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Subtitle { get; set; }
        public string Url { get; set; } = "";
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

}
