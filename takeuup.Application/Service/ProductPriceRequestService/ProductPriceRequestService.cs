using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class ProductPriceRequestService : IProductPriceRequestService
    {
        private readonly IBaseRepository<ProductPriceRequest> _priceRequestRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductPriceRequestService(
            IBaseRepository<ProductPriceRequest> priceRequestRepository,
            UserManager<ApplicationUser> userManager)
        {
            _priceRequestRepository = priceRequestRepository;
            _userManager = userManager;
        }

        public async Task CreateRequestAsync(Guid productId, Guid? userId, string message, string? guestName = null, string? guestPhone = null, string? guestEmail = null, string? guestAddress = null)
        {
            ProductPriceRequest? existing = null;
            if (userId.HasValue)
            {
                existing = await _priceRequestRepository.GetAsync(r => 
                    r.ProductId == productId && r.UserId == userId && r.Status == "Pending"
                );
            }
            else if (!string.IsNullOrEmpty(guestEmail))
            {
                existing = await _priceRequestRepository.GetAsync(r => 
                    r.ProductId == productId && r.GuestEmail == guestEmail && r.Status == "Pending"
                );
            }

            if (existing != null)
            {
                existing.Message = message;
                if (!userId.HasValue)
                {
                    existing.GuestName = guestName;
                    existing.GuestPhone = guestPhone;
                    existing.GuestAddress = guestAddress;
                }
                existing.SetUpdated();
                _priceRequestRepository.Update(existing);
            }
            else
            {
                var request = new ProductPriceRequest
                {
                    Id = Guid.NewGuid(),
                    ProductId = productId,
                    UserId = userId,
                    Message = message,
                    Status = "Pending",
                    GuestName = guestName,
                    GuestPhone = guestPhone,
                    GuestEmail = guestEmail,
                    GuestAddress = guestAddress
                };
                await _priceRequestRepository.AddAsync(request);
            }
            await _priceRequestRepository.SaveChangesAsync();
        }

        public async Task<List<ProductPriceRequestDetailsDto>> GetRequestsForAdminAsync()
        {
            var requests = await _priceRequestRepository.All
                .Include(r => r.Product)
                .ThenInclude(p => p.Images)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var list = new List<ProductPriceRequestDetailsDto>();
            foreach (var r in requests)
            {
                var user = r.UserId.HasValue ? await _userManager.FindByIdAsync(r.UserId.ToString()) : null;
                var primaryImage = r.Product?.Images?.FirstOrDefault(i => i.IsPrimary)?.Url;

                list.Add(new ProductPriceRequestDetailsDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product?.Name ?? "Unknown Product",
                    ProductSlug = r.Product?.Slug ?? string.Empty,
                    ProductImageUrl = primaryImage,
                    UserId = r.UserId,
                    CustomerEmail = user?.Email ?? r.GuestEmail ?? "unknown@user.com",
                    CustomerName = user?.FullName ?? r.GuestName ?? "Guest User",
                    Message = r.Message,
                    QuotedPrice = r.QuotedPrice,
                    Status = r.Status,
                    GuestPhone = r.GuestPhone,
                    GuestAddress = r.GuestAddress,
                    CreatedAt = r.CreatedAt
                });
            }
            return list;
        }

        public async Task QuotePriceAsync(Guid requestId, decimal price)
        {
            var request = await _priceRequestRepository.GetByIdAsync(requestId)
                ?? throw new Exception("Request not found");
            request.QuotedPrice = price;
            request.Status = "Quoted";
            request.SetUpdated();
            _priceRequestRepository.Update(request);
            await _priceRequestRepository.SaveChangesAsync();
        }

        public async Task<List<ProductPriceRequestDetailsDto>> GetRequestsForUserAsync(Guid userId)
        {
            var requests = await _priceRequestRepository.All
                .Include(r => r.Product)
                .ThenInclude(p => p.Images)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var list = new List<ProductPriceRequestDetailsDto>();
            foreach (var r in requests)
            {
                var primaryImage = r.Product?.Images?.FirstOrDefault(i => i.IsPrimary)?.Url;

                list.Add(new ProductPriceRequestDetailsDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product?.Name ?? "Unknown Product",
                    ProductSlug = r.Product?.Slug ?? string.Empty,
                    ProductImageUrl = primaryImage,
                    UserId = r.UserId,
                    Message = r.Message,
                    QuotedPrice = r.QuotedPrice,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                });
            }
            return list;
        }

        public async Task UpdateRequestMessageAsync(Guid requestId, Guid userId, string message)
        {
            var request = await _priceRequestRepository.GetByIdAsync(requestId)
                ?? throw new Exception("Request not found");
            if (request.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this request.");
            }
            request.Message = message;
            request.Status = "Pending";
            request.SetUpdated();
            _priceRequestRepository.Update(request);
            await _priceRequestRepository.SaveChangesAsync();
        }
    }
}
