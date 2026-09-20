using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductQueryService
    {
        Task<PagedResponse<ProductListItemDto>> SearchAsync(ProductQuery query, CancellationToken ct);
        Task<ProductDetailsDto?> GetByIdOrSlugAsync(string idOrSlug, CancellationToken ct);
        Task<ProductFiltersDto> GetFiltersAsync(ProductQuery query, CancellationToken ct);
        Task<IReadOnlyList<ProductListItemDto>> GetRelatedAsync(string productId, int take, CancellationToken ct);
    }
}
