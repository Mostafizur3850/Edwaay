using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Application.Generic;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductService
    {
        #region new parttern want to follow 
        Task<Guid> CreateAsync(CreateProductDto dto, CancellationToken ct);
        Task<List<ProductResponseDto>> GetAllAsync();
        Task<List<ProductResponseDto>> GetCategoryWiseAsync(string slug);
        Task<List<ProductResponseDto>> getBySlug(string slug);

        Task UpdateAsync(UpdateProductDto dto, CancellationToken ct);
        Task DeleteAsync(Guid id, CancellationToken ct);
        Task<ProductResponseDto?> GetByIdAsync(Guid id);


        Task ToggleStatusAsync(Guid id);

               

        Task<PagedResult<ProductResponseDto>> GetCategoryWiseFilteredAsync(string slug, CategoryProductFilterDto filter);

        Task<PagedResult<ProductResponseDto>> GetAllFilteredAsync(CategoryProductFilterDto filter);


        Task<List<SearchSuggestDto>> SuggestAsync(string keyword);


        Task<List<string>> GetUniqueTagsAsync();
        #endregion

    }
}
