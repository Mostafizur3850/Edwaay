using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICategoryService
    {  
        #region new parttern want to follow 
        Task<List<CategoryListDto>> GetAllAsync();
        Task CreateAsync(CategoryCreateUpdateDto dto, CancellationToken ct);
        Task UpdateAsync(Guid id, CategoryCreateUpdateDto dto, CancellationToken ct);

        Task DeleteAsync(Guid id);
        Task ToggleStatusAsync(Guid id);
        Task<Category?> GetByIdWithKeywordsAsync(Guid id, CancellationToken ct);
        #endregion

    }
}
