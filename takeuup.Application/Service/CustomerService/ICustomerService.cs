using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICustomerService
    {
        Task<List<CustomerListDto>> GetCustomersAsync();
        Task<CustomerDetailsDto?> GetCustomerByUserIdAsync(Guid userId);
        Task DeleteCustomerAsync(Guid userId);
    }
}
