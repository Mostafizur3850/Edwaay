using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IVendorProductService
    {
        Task<PagedResponse<ProductListItemDto>> MyListingsAsync(string vendorId, ProductQuery query, CancellationToken ct);
        Task<ProductDetailsDto> CreateListingAsync(string vendorId, CreateProductRequest req, CancellationToken ct);
        Task<ProductDetailsDto?> UpdateListingAsync(string vendorId, string productId, UpdateProductRequest req, CancellationToken ct);
        Task<bool> SubmitForApprovalAsync(string vendorId, string productId, CancellationToken ct);
    }
}
