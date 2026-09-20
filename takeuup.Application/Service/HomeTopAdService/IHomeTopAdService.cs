using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IHomeTopAdService
    {
        Task<HomeTopAdDto?> GetAsync();
        Task UpdateAsync(HomeTopAdUpdateDto dto);
    }
}
