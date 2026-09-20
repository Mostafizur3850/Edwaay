using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomeTopAd : BaseEntity
    {
        public string ImageUrl { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Url { get; set; } = null!;
        public bool IsActive { get; set; }
    }

}
