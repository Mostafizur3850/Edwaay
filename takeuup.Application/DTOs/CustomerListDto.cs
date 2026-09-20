using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class CustomerListDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
    }


    public class CustomerDetailsDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public bool IsSubscribed { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int TotalOrders { get; set; }
        public CustomerAddressDto? Address { get; set; }
    }

    public class CustomerAddressDto
    {
        public string Name { get; set; } = "";
        public string AddressLine { get; set; } = "";
        public string District { get; set; } = "";
        public string Mobile { get; set; } = "";
        public string Email { get; set; } = "";
    }


}
