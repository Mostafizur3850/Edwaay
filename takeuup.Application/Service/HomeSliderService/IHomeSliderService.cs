using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service.HomeSliderService
{
    public interface IHomeSliderService
    {
        Task<List<HomeSliderDto>> GetAsync();
        Task UpsertAsync(HomeSliderUpsertDto dto);
        Task DeleteAsync(Guid id);
    }
}
