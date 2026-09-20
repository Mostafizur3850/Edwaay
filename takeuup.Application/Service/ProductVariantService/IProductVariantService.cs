using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductVariantService
    {
        
        Task UpdateAsync(Guid id, ProductVariantUpdateDto dto);
        Task DeleteAsync(Guid id);
        //Task<ProductResponseDto?> GetByIdAsync(Guid id);
        Task<List<ProductVariantDto>> GetAllAsync();

    }
}
