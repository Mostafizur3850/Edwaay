using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class EventCategory : BaseEntity
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool IsActive { get; set; } = true;

        // Relationship with Events
        public virtual ICollection<Event> Events { get; set; }
    }
}
