using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IOrderService
    {
      Task<OrderCreateResultDto> CreateOrderAsync( Guid? userId, string? sessionId,  OrderCreateDto dto );
        //Task<PagedResultDto<OrderListItemDto>> GetOrdersAsync(int page, int pageSize, string? search, DateTime? startDate, DateTime? endDate);
        Task<List<OrderListItemDto>> GetOrdersAsync(string? search, DateTime? startDate, DateTime? endDate);
        Task<List<OrderListItemDto>> GetOrdersByUserAsync(string? search, DateTime? startDate, DateTime? endDate, Guid? userId);
      Task DeleteOrderAsync(Guid orderId, Guid? userId);


        Task UpdateOrderStatusAsync(Guid orderId, string status, Guid? userId);
        Task<OrderInvoiceDto> GetOrderInvoiceAsync(Guid orderId, Guid? userId);

        Task UpdatePaymentStatusAsync(Guid orderId, string paymentStatus, Guid? userId);

        Task<OrderTrackDto?> TrackOrderAsync(string orderNumber, string phone);

       }
}
