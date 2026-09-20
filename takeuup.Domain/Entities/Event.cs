using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class Event : BaseEntity 
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime EventDate { get; set; }
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; }

        // Optional: If you want event categories
        public Guid? EventCategoryId { get; set; }
        public virtual EventCategory EventCategory { get; set; }
    }
}
