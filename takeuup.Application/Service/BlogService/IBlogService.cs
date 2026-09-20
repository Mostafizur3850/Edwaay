using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IBlogService
    {
        Task<List<BlogListDto>> GetAllAsync();
        Task CreateAsync(BlogCreateUpdateDto dto, CancellationToken ct);
        Task DeleteAsync(Guid id);
        Task UpdateAsync(Guid id, BlogCreateUpdateDto dto, CancellationToken ct); // ✅ ADD

       Task<BlogDetailsDto> GetByIdAsync(Guid id);

        Task<BlogDetailsDto> GetBySlugAsync(string slug);


        Task<List<BlogCategoryDto>> GetAllCategoriesAsync();
        Task<List<BlogListDto>> GetByCategorySlugAsync(string slug);
    }
}
