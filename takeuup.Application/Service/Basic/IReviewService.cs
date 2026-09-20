using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IReviewService
    {
        Task<PagedResponse<object>> GetByProductAsync(string productId, int page, int pageSize, CancellationToken ct);
        Task<object> CreateAsync(string productId, int rating, string? comment, CancellationToken ct);
        Task<bool> DeleteAsync(string reviewId, CancellationToken ct);
        Task<bool> ApproveAsync(string reviewId, bool approved, CancellationToken ct);
    }
}
