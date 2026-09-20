using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;

namespace ECommerce.Application.Service
{

    public interface IBlogCategoryService
    {        
        Task<List<BlogCategoryListDto>> GetAllAsync();
        Task CreateAsync(BlogCategoryCreateDto dto, CancellationToken ct);
        Task ToggleStatusAsync(Guid id, CancellationToken ct);
        Task DeleteAsync(Guid id, CancellationToken ct);
        Task<BlogCategoryDetailsDto> GetByIdAsync(Guid id);

        Task UpdateAsync(Guid id, BlogCategoryCreateDto dto, CancellationToken ct);
    }



}
