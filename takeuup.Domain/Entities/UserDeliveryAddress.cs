using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class UserDeliveryAddress : BaseEntity
    {
       
        public Guid UserId { get; set; }   
        public string Name { get; set; }         
        public string AddressLine { get; set; }
        public string District { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public bool IsDefault { get; set; }
        public ApplicationUser User { get; set; }
    }
}
