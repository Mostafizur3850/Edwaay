using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductPriceRequestService
    {
        Task CreateRequestAsync(Guid productId, Guid? userId, string message, string? guestName = null, string? guestPhone = null, string? guestEmail = null, string? guestAddress = null);
        Task<List<ProductPriceRequestDetailsDto>> GetRequestsForAdminAsync();
        Task QuotePriceAsync(Guid requestId, decimal price);
        Task<List<ProductPriceRequestDetailsDto>> GetRequestsForUserAsync(Guid userId);
        Task UpdateRequestMessageAsync(Guid requestId, Guid userId, string message);
    }
}
