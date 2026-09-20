using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;
namespace ECommerce.Application.Service
{
    public interface IFaqService
    {
        Task<List<FaqListDto>> GetAllAsync();
        Task CreateAsync(FaqCreateUpdateDto dto);
        Task UpdateAsync(Guid id, FaqCreateUpdateDto dto);
        Task ToggleStatusAsync(Guid id);
        Task DeleteAsync(Guid id);
    }

}
