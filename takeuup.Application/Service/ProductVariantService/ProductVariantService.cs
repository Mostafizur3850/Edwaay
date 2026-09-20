using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using System.Linq;

namespace ECommerce.Application.Service
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IBaseRepository<ProductVariant> _productVariantRepository;

        public ProductVariantService(
            IBaseRepository<ProductVariant> productVariantRepository
        )
        {
            _productVariantRepository = productVariantRepository;
        }

        // ================= GET ALL =================
        public async Task<List<ProductVariantDto>> GetAllAsync()
        {
            var variants = await _productVariantRepository.GetAllAsync();

            return variants.Select(v => new ProductVariantDto(
                id: v.Id,
                sku: v.Sku,
                price: v.Price,
                stock: v.Stock,
                isActive: v.IsActive,
                oldPrice: v.OldPrice
            )).ToList();
        }

        // ================= CREATE =================
        public async Task CreateAsync(ProductVariantCreateDto dto)
        {
            var variant = new ProductVariant
            {
                ProductId = dto.ProductId,
                Sku = dto.Sku,
                Price = dto.Price,
                OldPrice = dto.OldPrice,
                Stock = dto.Stock,
                IsActive = true
            };

            await _productVariantRepository.AddAsync(variant);
            await _productVariantRepository.SaveChangesAsync();
        }

        // ================= UPDATE =================
        public async Task UpdateAsync(Guid id, ProductVariantUpdateDto dto)
        {
            var variant = await _productVariantRepository.GetByIdAsync(id);
            if (variant == null)
                throw new Exception("Product variant not found");

            variant.Price = dto.Price;
            variant.OldPrice = dto.OldPrice;
            variant.Stock = dto.Stock;
            variant.IsActive = dto.IsActive;

            _productVariantRepository.Update(variant);
            await _productVariantRepository.SaveChangesAsync();
        }

        // ================= DELETE =================
        public async Task DeleteAsync(Guid id)
        {
            var variant = await _productVariantRepository.GetByIdAsync(id);
            if (variant == null) return;

            _productVariantRepository.Delete(variant);
            await _productVariantRepository.SaveChangesAsync();
        }

        // ================= TOGGLE STATUS =================
        public async Task ToggleStatusAsync(Guid id)
        {
            var variant = await _productVariantRepository.GetByIdAsync(id);
            if (variant == null) return;

            variant.IsActive = !variant.IsActive;
            _productVariantRepository.Update(variant);
            await _productVariantRepository.SaveChangesAsync();
        }

  
    }
}
