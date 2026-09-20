using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICartService
    {
        Task<CartDto?> GetAsync(Guid? userId, string? sessionId);
        Task AddAsync(Guid? userId, string? sessionId, CartItemCreateDto dto);
        Task UpdateQtyAsync(Guid itemId, int qty);
        Task RemoveItemAsync(Guid itemId);
        Task ClearAsync(Guid? userId, string? sessionId);
        Task MergeAsync(Guid userId, string sessionId);
    }
}
