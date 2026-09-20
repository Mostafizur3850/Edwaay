using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductAdminService
    {
        Task<ProductDetailsDto> CreateAsync(CreateProductRequest req, CancellationToken ct);
        Task<ProductDetailsDto?> UpdateAsync(string id, UpdateProductRequest req, CancellationToken ct);
        Task<bool> DeleteAsync(string id, CancellationToken ct);
        Task<bool> SetPublishAsync(string id, bool isPublished, CancellationToken ct);
        Task<int> BulkPublishAsync(BulkPublishRequest req, CancellationToken ct);
    }
}
