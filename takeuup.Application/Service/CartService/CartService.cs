using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace ECommerce.Application.Service
{
    public class CartService : ICartService
    {
        private readonly IBaseRepository<Cart> _cartRepo;
        private readonly IBaseRepository<CartItem> _cartItemRepo;
        private readonly IBaseRepository<Product> _productRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBaseRepository<ProductVariant> _variantRepo;


        public CartService(
            IBaseRepository<Cart> cartRepo,
            IBaseRepository<CartItem> cartItemRepo,
            IBaseRepository<Product> productRepo,
            IUnitOfWork unitOfWork,
            IBaseRepository<ProductVariant> variantRepo)
        {
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
            _unitOfWork = unitOfWork;
            _variantRepo = variantRepo;
        }

        /* ================= GET OR CREATE CART ================= */
        private async Task<Cart> GetOrCreateCartAsync(Guid? userId, string? sessionId)
        {
            Cart? cart = null;

            // ================= USER CART =================
            if (userId.HasValue)
            {
                cart = await _cartRepo.GetAsync(
                    c => c.UserId == userId,
                    include: q => q
                        .Include(c => c.Items)
                        .ThenInclude(i => i.ProductVariant)
                );
            }
            // ================= GUEST CART =================
            else
            {
                if (string.IsNullOrWhiteSpace(sessionId))
                    throw new Exception("SessionId is required for guest cart");

                cart = await _cartRepo.GetAsync(
                    c => c.SessionId == sessionId,
                    include: q => q
                        .Include(c => c.Items)
                        .ThenInclude(i => i.ProductVariant)
                );
            }

            if (cart != null)
                return cart;

            // ================= CREATE NEW CART =================
            cart = new Cart
            {
                UserId = userId,
                SessionId = userId.HasValue ? null : sessionId
            };

            await _cartRepo.AddAsync(cart);
            await _unitOfWork.CommitAsync();

            return cart;
        }

        /* ================= GET CART ================= */
        public async Task<CartDto?> GetAsync(Guid? userId, string? sessionId)
        {
            var cart = await _cartRepo.All.Include(c => c.Items)
         .ThenInclude(i => i.ProductVariant).ThenInclude(v => v.Product).ThenInclude(p => p.Images) 
     .FirstOrDefaultAsync(c => (userId.HasValue && c.UserId == userId) ||   (!userId.HasValue && c.SessionId == sessionId) );


            if (cart == null) return null;

            return new CartDto
            {
                Id = cart.Id,
                Items = cart.Items.Select(i => new CartItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductVariantId = i.ProductVariantId.Value,
                    Name = i.ProductVariant.Product.Name,
                    Slug = i.ProductVariant.Product.Slug,

                    Image =
         i.ProductVariant.Product.Images
             .FirstOrDefault(img => img.IsPrimary)?.Url
         ?? i.ProductVariant.Product.Images
             .FirstOrDefault()?.Url
         ?? "",

                    Price = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList()
            };
        }


        /* ================= ADD ITEM ================= */
        public async Task AddAsync(Guid? userId, string? sessionId, CartItemCreateDto dto)
        {
            if (!userId.HasValue && string.IsNullOrWhiteSpace(sessionId))
                throw new ValidationException("SessionId is required for guest cart");

            if (dto.Quantity <= 0)
                throw new ValidationException("Quantity must be greater than zero");

            var variantId = dto.ProductVariantId;
            if (variantId == Guid.Empty)
            {
                var variants = await _variantRepo.FindAsync(v => v.ProductId == dto.ProductId);
                var defaultVariant = variants.FirstOrDefault();
                if (defaultVariant == null)
                {
                    throw new Exception("Product variant not found");
                }
                variantId = defaultVariant.Id;
            }

            var variant = await _variantRepo.GetByIdAsync(variantId)
                ?? throw new Exception("Product variant not found");

            var cart = await GetOrCreateCartAsync(userId, sessionId);

            var item = cart.Items
                .FirstOrDefault(i => i.ProductVariantId == variantId);

            if (item != null)
            {
                item.Quantity += dto.Quantity;
                _cartItemRepo.Update(item);
            }
            else
            {
                await _cartItemRepo.AddAsync(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = variant.ProductId,
                    ProductVariantId = variant.Id,
                    Quantity = dto.Quantity,
                    UnitPrice = variant.Price
                });
            }

            await _unitOfWork.CommitAsync();
        }




        /* ================= UPDATE QTY ================= */
        public async Task UpdateQtyAsync(Guid itemId, int qty)
        {
            var item = await _cartItemRepo.GetByIdAsync(itemId);
            if (item == null) return;
            item.Quantity = qty;
            _cartItemRepo.Update(item);
            await _unitOfWork.CommitAsync();
        }

        /* ================= REMOVE ITEM ================= */
        public async Task RemoveItemAsync(Guid itemId)
        {
            var item = await _cartItemRepo.GetByIdAsync(itemId);
            if (item == null) return;
            _cartItemRepo.Remove(item);
            await _unitOfWork.CommitAsync();
        }

        /* ================= CLEAR CART ================= */
        public async Task ClearAsync(Guid? userId, string? sessionId)
        {
            var cart = await GetOrCreateCartAsync(userId, sessionId);
            foreach (var item in cart.Items)
            {
                _cartItemRepo.Remove(item);
            }

            await _unitOfWork.CommitAsync();
        }

        /* ================= MERGE CART ================= */
        public async Task MergeAsync(Guid userId, string sessionId)
        {
            var guestCart = await _cartRepo.GetAsync(
                c => c.SessionId == sessionId,
                include: q => q.Include(c => c.Items)
            );

            if (guestCart == null || !guestCart.Items.Any())
                return;

            var userCart = await _cartRepo.GetAsync(
                c => c.UserId == userId,
                include: q => q.Include(c => c.Items)
            );

            if (userCart == null)
            {
                userCart = new Cart { UserId = userId };
                await _cartRepo.AddAsync(userCart);
            }

            foreach (var guestItem in guestCart.Items)
            {
                var existing = userCart.Items
                    .FirstOrDefault(i => i.ProductVariantId == guestItem.ProductVariantId);

                if (existing != null)
                {
                    existing.Quantity += guestItem.Quantity;
                    _cartItemRepo.Update(existing);
                }
                else
                {
                    await _cartItemRepo.AddAsync(new CartItem
                    {
                        CartId = userCart.Id,
                        ProductId = guestItem.ProductId,
                        ProductVariantId = guestItem.ProductVariantId,
                        Quantity = guestItem.Quantity,
                        UnitPrice = guestItem.UnitPrice
                    });
                    await _unitOfWork.CommitAsync();
                }
            }

            _cartRepo.Remove(guestCart);

            // ✅ ONLY ONE SAVE
           
        }


    }
}
