using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IFaqCategoryService
    {
        Task<List<FaqCategoryDto>> GetAllAsync();
        Task CreateAsync(FaqCategoryCreateDto dto);
        Task ToggleStatusAsync(Guid id);
        Task DeleteAsync(Guid id);
    }

}
