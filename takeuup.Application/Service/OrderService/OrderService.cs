using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ECommerce.Application.Service
{
    public class OrderService : IOrderService
    {
        private readonly IBaseRepository<Order> _orderRepo;
        private readonly IBaseRepository<OrderItem> _orderItemRepo;
        private readonly IBaseRepository<CartItem> _cartItemRepo;
        private readonly IBaseRepository<Product> _productRepo;
        private readonly IBaseRepository<ProductVariant> _variantRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _sslService;
        private readonly IGeneralSettingService _generalSettingService;
        private readonly IUserDeliveryAddressService _userDeliveryAddressService;
        private readonly IUserProfileService _userProfileService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBaseRepository<Coupon> _couponRepo;
        private readonly IBaseRepository<OrderAddress> _orderAddressRepo;
        public OrderService(
            IBaseRepository<Order> orderRepo,
            IBaseRepository<CartItem> cartItemRepo,
            IBaseRepository<Product> productRepo,
            IBaseRepository<ProductVariant> variantRepo,
            IUnitOfWork unitOfWork,
            IBaseRepository<OrderItem> orderItemRepo,
            IPaymentService sslService,
            IGeneralSettingService generalSettingService,
            IUserDeliveryAddressService userDeliveryAddressService,
            IUserProfileService userProfileService, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor, IBaseRepository<Coupon> couponRepo, IBaseRepository<OrderAddress> orderAddressRepo)
        {
            _orderRepo = orderRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
            _variantRepo = variantRepo;
            _unitOfWork = unitOfWork;
            _orderItemRepo = orderItemRepo;
            _sslService = sslService;
            _generalSettingService = generalSettingService;
            _userDeliveryAddressService = userDeliveryAddressService;
            _userProfileService = userProfileService;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _couponRepo = couponRepo;
            _orderAddressRepo = orderAddressRepo;
        }

        public async Task<OrderCreateResultDto> CreateOrderAsync(
            Guid? userId,
            string? sessionId,
            OrderCreateDto dto)
        {
            Guid? finalUserId = userId;
            string? tempPassword = null;

            /* ================= REGISTER (GUEST ACCOUNT CREATE) ================= */

            if (!finalUserId.HasValue && dto.CreateAccount && dto.RegisterData != null)
            {
                var existingUser =
                    await _userManager.FindByEmailAsync(dto.RegisterData.Email);

                if (existingUser == null)
                {
                    var password = PasswordGenerator.Generate();
                    tempPassword = password;

                    var user = new ApplicationUser
                    {
                        UserName = dto.RegisterData.Email,
                        Email = dto.RegisterData.Email,
                        FullName = dto.RegisterData.FullName,
                        PhoneNumber = dto.RegisterData.PhoneNumber,
                        IsActive = true
                    };

                    var result = await _userManager.CreateAsync(user, password);
                    if (!result.Succeeded)
                        throw new ValidationException("User registration failed");

                    await _userManager.AddToRoleAsync(user, "User");

                    finalUserId = Guid.Parse(user.Id);
                }
                else
                {
                    finalUserId = Guid.Parse(existingUser.Id);
                }
            }

            /* ================= VALIDATION ================= */

            if (!finalUserId.HasValue && string.IsNullOrWhiteSpace(sessionId))
                throw new ValidationException("SessionId is required for guest checkout");

            if (dto.CartItemIds == null || !dto.CartItemIds.Any())
                throw new ValidationException("No cart items selected");

            /* ================= LOAD CART ITEMS ================= */

            var cartItems = await _cartItemRepo.All
                .Include(ci => ci.Cart)
                .Where(ci =>
                    dto.CartItemIds.Contains(ci.Id) &&
                    (
                        (sessionId != null && ci.Cart.SessionId == sessionId)
                        || (finalUserId.HasValue && ci.Cart.UserId == finalUserId)
                    )
                )
                .ToListAsync();

            if (!cartItems.Any())
                throw new ValidationException("Cart items not found");

            /* ================= CALCULATION ================= */

            decimal subtotal = cartItems.Sum(x => x.UnitPrice * x.Quantity);
            decimal shipping = dto.Shipping;
            decimal discount = 0;

            /* ================= COUPON LOGIC ================= */

            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                var coupon = await _couponRepo.All
                    .FirstOrDefaultAsync(c => c.Code == dto.CouponCode);

                if (coupon == null || !coupon.IsActive)
                    throw new ValidationException("Invalid coupon");

                if (coupon.ExpiryDate.HasValue &&
                    coupon.ExpiryDate.Value < DateTime.UtcNow)
                    throw new ValidationException("Coupon expired");

                if (coupon.DiscountType == "Percentage")
                    discount = subtotal * coupon.Discount / 100m;
                else
                    discount = coupon.Discount;

                discount = Math.Min(discount, subtotal);
            }

            decimal grandTotal = subtotal - discount + shipping;
            if (grandTotal < 0) grandTotal = 0;

            /* ================= CREATE ORDER ================= */

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
                UserId = finalUserId,
                Currency = dto.Currency,
                Subtotal = subtotal,
                Shipping = shipping,
                Discount = discount,
                CouponCode = dto.CouponCode,
                GrandTotal = grandTotal,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Pending",
                Status = dto.PaymentMethod == "COD"
                    ? "Confirmed"
                    : "AwaitingPayment",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await _orderRepo.AddAsync(order);

            /* ================= ORDER ITEMS ================= */

            foreach (var cartItem in cartItems)
            {
                var product = await _productRepo.GetByIdAsync(cartItem.ProductId);

                var variant = cartItem.ProductVariantId.HasValue
                    ? await _variantRepo.GetByIdAsync(cartItem.ProductVariantId.Value)
                    : null;

                await _orderItemRepo.AddAsync(new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = cartItem.ProductId,
                    VariantId = cartItem.ProductVariantId,
                    ProductName = product?.Name ?? "Unknown",
                    Sku = variant?.Sku,
                    UnitPrice = cartItem.UnitPrice,
                    Quantity = cartItem.Quantity,
                    LineTotal = cartItem.UnitPrice * cartItem.Quantity,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                });
            }

            /* ================= SAVE ORDER + ITEMS ================= */

            await _unitOfWork.CommitAsync();

            /* ================= SAVE ORDER ADDRESS ================= */

            await _orderAddressRepo.AddAsync(new OrderAddress
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Name = dto.Address.Name,
                Phone = dto.Address.Phone,
                Email = dto.Address.Email ?? "",
                District = dto.Address.District,
                AddressLine = dto.Address.AddressLine
            });

            /* ================= CLEAR CART ================= */

            foreach (var cartItem in cartItems)
                _cartItemRepo.Remove(cartItem);

            await _unitOfWork.CommitAsync();

            /* ================= PAYMENT ================= */

            if (dto.PaymentMethod != null && (dto.PaymentMethod.Equals("SSL", StringComparison.OrdinalIgnoreCase) || dto.PaymentMethod.Equals("bKash", StringComparison.OrdinalIgnoreCase)))
            {
                var initDto = new PaymentInitDto
                {
                    OrderId = order.Id,
                    Amount = order.GrandTotal,
                    Currency = order.Currency,
                    CustomerName = dto.Address.Name,
                    Phone = dto.Address.Phone,
                    Email = dto.Address.Email ?? "",
                    Address = $"{dto.Address.AddressLine}, {dto.Address.District}"
                };

                PaymentInitResultDto paymentInit;
                if (dto.PaymentMethod.Equals("SSL", StringComparison.OrdinalIgnoreCase))
                {
                    paymentInit = await _sslService.InitSslPaymentAsync(initDto);
                }
                else
                {
                    paymentInit = await _sslService.InitBkashPaymentAsync(initDto);
                }

                return new OrderCreateResultDto
                {
                    OrderId = order.Id,
                    Status = "Redirect",
                    RedirectUrl = paymentInit.GatewayUrl
                };
            }

            return new OrderCreateResultDto
            {
                OrderId = order.Id,
                Status = "Confirmed",
                AccountCreated = tempPassword != null,
                TempPassword = tempPassword
            };
        }




        public async Task<List<OrderListItemDto>> GetOrdersByUserAsync(string? search, DateTime? startDate, DateTime? endDate, Guid? userId)
        {
            var query = _orderRepo.All.AsQueryable().Where(x=>x.UserId == userId);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x => x.OrderNumber.Contains(search));

            if (startDate.HasValue)
                query = query.Where(x => x.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(x => x.CreatedAt <= endDate.Value);

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new OrderListItemDto
                {
                    Id = x.Id,
                    OrderNumber = x.OrderNumber,
                    GrandTotal = x.GrandTotal,
                    PaymentStatus = x.PaymentStatus,
                    Status = x.Status,
                    CreatedAt = x.CreatedAt.ToString("MMMM dd, yyyy"),
                    PaymentMethod = x.PaymentMethod,
                    TotalAmount =x.Subtotal,
                    Shipping = x.Shipping,
                    Tax=x.Tax

                })
                .ToListAsync();
        }



        public async Task<List<OrderListItemDto>> GetOrdersAsync(
    string? search,
    DateTime? startDate,
    DateTime? endDate)
        {
            var query = _orderRepo.All.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x => x.OrderNumber.Contains(search));

            if (startDate.HasValue)
                query = query.Where(x => x.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(x => x.CreatedAt <= endDate.Value);

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new OrderListItemDto
                {
                    Id = x.Id,
                    OrderNumber = x.OrderNumber,
                    GrandTotal = x.GrandTotal,
                    PaymentStatus = x.PaymentStatus,
                    Status = x.Status,
                    CreatedAt = x.CreatedAt.ToString("MMMM dd, yyyy"),
                    PaymentMethod = x.PaymentMethod
                })
                .ToListAsync();
        }



        public async Task DeleteOrderAsync(Guid orderId, Guid? userId)
        {
            var order = await _orderRepo.All
                .Include(o => o.Items)     // ✅ correct
                .Include(o => o.Payment)   // ✅ correct (single payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            // 🔐 Optional security check
            if (userId.HasValue && order.UserId != userId)
                throw new UnauthorizedAccessException("You cannot delete this order");

            // ❗ Business rule (optional but recommended)
            if (order.Status == "Delivered")
                throw new ValidationException("Delivered order cannot be deleted");

            // 🧹 EF will auto delete:
            // OrderItems
            // Payments
            // paymentTransactions
            // paymentLogs
            _orderRepo.Remove(order);

            await _unitOfWork.CommitAsync();
        }



 
        public async Task UpdateOrderStatusAsync( Guid orderId,   string status,  Guid? userId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null)
                throw new Exception("Order not found");

            var allowedStatuses = new[]
            {  "Pending", "Confirmed", "AwaitingPayment", "Shipped",  "Delivered", "Cancelled" };

            if (!allowedStatuses.Contains(status))
                throw new Exception("Invalid order status");

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

             _orderRepo.Update(order);
           await _orderRepo.SaveChangesAsync();

        }



        public async Task<OrderInvoiceDto> GetOrderInvoiceAsync(Guid orderId, Guid? userId)
        {
            var order = await _orderRepo.All
                .Include(o => o.Items)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            // 🔐 Security
            var user = _httpContextAccessor.HttpContext?.User;
            bool isAdmin = user?.IsInRole("Admin") ?? false;                       
            var siteInfo = await _generalSettingService.GetAsync();

            // ✅ 1️⃣ FIRST get OrderAddress (important for guest)
            var orderAddress = await _orderAddressRepo.All
                .FirstOrDefaultAsync(a => a.OrderId == orderId);

            // ✅ 2️⃣ Optional: User profile
            UserProfileDto? userProfile = null;
            if (order.UserId.HasValue)
            {
                userProfile = await _userProfileService.GetAsync(order.UserId.Value);
            }

            return new OrderInvoiceDto
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                OrderDate = order.CreatedAt.ToString("MMMM dd, yyyy"),
                IssueDate = DateTime.UtcNow.ToString("MMMM dd, yyyy"),

                ShopName = siteInfo.AppName,
                ShopAddress = siteInfo.StoreAddress,
                ShopPhone = siteInfo.StorePhone,
                ShopEmail = siteInfo.StoreEmail,

                Customer = new InvoiceCustomerDto
                {
                    Name = orderAddress?.Name ?? userProfile?.Name ?? "Guest",
                    Address = orderAddress?.AddressLine ?? "",
                    Mobile = orderAddress?.Phone ?? userProfile?.PhoneNumber ?? "",
                    Email = orderAddress?.Email ?? userProfile?.Email ?? ""
                },

                Delivery = new InvoiceDeliveryDto
                {
                    Name = orderAddress?.Name ?? "",
                    AddressLine = orderAddress?.AddressLine ?? "",
                    District = orderAddress?.District ?? "",
                    Mobile = orderAddress?.Phone ?? "",
                    Email = orderAddress?.Email ?? ""
                },

                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                TransactionId = order.Payment?.TransactionId,

                Subtotal = order.Subtotal,
                Tax = order.Tax,
                Shipping = order.Shipping,
                Discount = order.Discount,
                CouponCode = order.CouponCode,
                GrandTotal = order.GrandTotal,

                Items = order.Items.Select(i => new OrderInvoiceItemDto
                {
                    ProductName = i.ProductName,
                    Sku = i.Sku,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.LineTotal
                }).ToList()
            };
        }



        public async Task UpdatePaymentStatusAsync(
    Guid orderId,
    string paymentStatus,
    Guid? userId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            order.PaymentStatus = paymentStatus;
            await _orderRepo.SaveChangesAsync();
        }




        public async Task<OrderTrackDto?> TrackOrderAsync(
      string orderNumber,
      string phone)
        {
            return await _orderRepo.All
                .Include(o => o.Address)
                .Where(o =>
                    o.OrderNumber == orderNumber &&
                    o.Address.Phone == phone)
                .Select(o => new OrderTrackDto
                {
                    OrderNumber = o.OrderNumber,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    GrandTotal = o.GrandTotal,
                    CreatedAt = o.CreatedAt
                })
                .FirstOrDefaultAsync();
        }
    }
}
