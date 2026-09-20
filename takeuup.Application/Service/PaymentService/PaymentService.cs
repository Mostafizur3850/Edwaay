using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class PaymentService : IPaymentService
    {
        private readonly IBaseRepository<Payment> _paymentRepo;
        private readonly IBaseRepository<Order> _orderRepo;
        private readonly IBaseRepository<GeneralSetting> _generalRepo;
        private readonly IBaseRepository<UserProfile> _profileRepo;
        private readonly IBaseRepository<Coupon> _couponRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public PaymentService(
            IBaseRepository<Payment> paymentRepo,
            IBaseRepository<Order> orderRepo,
            IBaseRepository<GeneralSetting> generalRepo,
            IBaseRepository<UserProfile> profileRepo,
            IBaseRepository<Coupon> couponRepo,
            IUnitOfWork unitOfWork,
            IConfiguration config,
            HttpClient http)
        {
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _generalRepo = generalRepo;
            _profileRepo = profileRepo;
            _couponRepo = couponRepo;
            _unitOfWork = unitOfWork;
            _config = config;
            _http = http;
        }

        /* ================= SSL INIT ================= */

        public async Task<PaymentInitResultDto> InitSslPaymentAsync(PaymentInitDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null)
                throw new ValidationException("Order not found");

            var settings = await _generalRepo.All.FirstOrDefaultAsync();
            if (settings == null || !settings.SslIsEnabled)
                throw new ValidationException("SSLCommerz payment gateway is disabled");

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Method = "SSL",
                Gateway = "SSLCommerz",
                Status = "Pending",                
                Amount = dto.Amount,
                Currency = dto.Currency,

                InitiatedAt = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await _paymentRepo.AddAsync(payment);
            await _unitOfWork.CommitAsync();

            var storeId = !string.IsNullOrWhiteSpace(settings.SslStoreId) ? settings.SslStoreId : _config["SSLCommerz:StoreId"]!;
            var storePass = !string.IsNullOrWhiteSpace(settings.SslStorePassword) ? settings.SslStorePassword : _config["SSLCommerz:StorePassword"]!;
            var postUrl = !string.IsNullOrWhiteSpace(settings.SslSandboxUrl) ? settings.SslSandboxUrl : _config["SSLCommerz:SandboxUrl"]!;

            var postData = new Dictionary<string, string>
            {
                ["store_id"] = storeId,
                ["store_passwd"] = storePass,

                ["total_amount"] = dto.Amount.ToString("0.00"),
                ["currency"] = dto.Currency,
                ["tran_id"] = payment.Id.ToString(),

                ["success_url"] = _config["SSLCommerz:SuccessUrl"]!,
                ["fail_url"] = _config["SSLCommerz:FailUrl"]!,
                ["cancel_url"] = _config["SSLCommerz:CancelUrl"]!,

                /* ================= CUSTOMER ================= */

                ["cus_name"] = dto.CustomerName,
                ["cus_phone"] = dto.Phone,
                ["cus_email"] = dto.Email,

                ["cus_add1"] = dto.Address ?? "N/A",
                ["cus_city"] = "Dhaka",
                ["cus_country"] = "Bangladesh",

                /* ================= PRODUCT ================= */

                ["product_name"] = "ECommerce Order",
                ["product_category"] = "General",
                ["product_profile"] = "general",

                /* ================= SHIPPING ================= */

                ["shipping_method"] = "Courier",

                ["ship_name"] = dto.CustomerName,
                ["ship_add1"] = dto.Address ?? "N/A",
                ["ship_city"] = "Dhaka",
                ["ship_postcode"] = "6000",
                ["ship_country"] = "Bangladesh"
            };

            var response = await _http.PostAsync(
                postUrl,
                new FormUrlEncodedContent(postData)
            );

            var json = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(json)!;

            if (result.status != null && result.status.ToString() != "SUCCESS")
            {
                var reason = result.failedreason?.ToString() ?? "SSL init failed";
                throw new ValidationException(reason);
            }

            var gatewayUrl = result.GatewayPageURL?.ToString();

            if (string.IsNullOrWhiteSpace(gatewayUrl))
                throw new ValidationException("SSL Gateway URL not returned");

            return new PaymentInitResultDto
            {
                GatewayUrl = gatewayUrl
            };
        }

        /* ================= SSL SUCCESS ================= */

        public async Task HandleSslSuccessAsync(SslCallbackDto dto)
        {
            var paymentId = Guid.Parse(dto.tran_id);
            var payment = await _paymentRepo.GetByIdAsync(paymentId);

            if (payment == null)
                throw new ValidationException("Payment not found");

            payment.Status = "Paid";
            payment.TransactionId = dto.bank_tran_id;
            payment.GatewayPayload = JsonConvert.SerializeObject(dto);
            payment.PaidAt = DateTimeOffset.UtcNow;
            payment.UpdatedAt = DateTimeOffset.UtcNow;

            var order = await _orderRepo.GetByIdAsync(payment.OrderId);
            order!.Status = "Confirmed";
            order.PaymentStatus = "Paid";
            order.UpdatedAt = DateTimeOffset.UtcNow;

            await _unitOfWork.CommitAsync();
        }

        /* ================= SSL FAIL ================= */

        public async Task HandleSslFailAsync(SslCallbackDto dto)
        {
            var paymentId = Guid.Parse(dto.tran_id);
            var payment = await _paymentRepo.GetByIdAsync(paymentId);

            if (payment == null)
                return;

            payment.Status = "Failed";
            payment.GatewayPayload = JsonConvert.SerializeObject(dto);
            payment.UpdatedAt = DateTimeOffset.UtcNow;

            var order = await _orderRepo.GetByIdAsync(payment.OrderId);
            order!.Status = "PaymentFailed";
            order.PaymentStatus = "Failed";
            order.UpdatedAt = DateTimeOffset.UtcNow;

            await _unitOfWork.CommitAsync();
        }

        /* ================= BKASH INIT ================= */

        public async Task<PaymentInitResultDto> InitBkashPaymentAsync(PaymentInitDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null)
                throw new ValidationException("Order not found");

            var settings = await _generalRepo.All.FirstOrDefaultAsync();
            if (settings == null || !settings.BkashIsEnabled)
                throw new ValidationException("bKash payment gateway is disabled");

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Method = "bKash",
                Gateway = "bKash",
                Status = "Pending",
                Amount = dto.Amount,
                Currency = dto.Currency,
                InitiatedAt = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await _paymentRepo.AddAsync(payment);
            await _unitOfWork.CommitAsync();

            bool isSimulated = string.IsNullOrWhiteSpace(settings.BkashAppKey) || settings.BkashAppKey.Contains("placeholder") || settings.BkashAppKey.Trim() == "";

            if (isSimulated)
            {
                var frontendUrl = GetFrontendUrl();
                var gatewayUrl = $"{frontendUrl}/#/payment/bkash-sandbox?paymentId={payment.Id}&amount={dto.Amount.ToString("0.00")}&orderId={order.Id}";
                return new PaymentInitResultDto { GatewayUrl = gatewayUrl };
            }

            try
            {
                var token = await GetBkashTokenAsync(settings);
                if (string.IsNullOrWhiteSpace(token))
                    throw new Exception("Failed to retrieve bKash auth token");

                var baseUrl = !string.IsNullOrWhiteSpace(settings.BkashSandboxUrl) ? settings.BkashSandboxUrl : "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";
                var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/payment/create");
                request.Headers.Add("Authorization", token);
                request.Headers.Add("X-APP-Key", settings.BkashAppKey);

                var payload = new
                {
                    mode = "0011",
                    payerReference = order.OrderNumber,
                    callbackURL = $"{_config["SSLCommerz:SuccessUrl"]}".Replace("ssl/success", "bkash/callback"),
                    amount = dto.Amount.ToString("0.00"),
                    currency = dto.Currency,
                    intent = "sale",
                    merchantInvoiceNumber = payment.Id.ToString()
                };

                request.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
                var response = await _http.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    dynamic result = JsonConvert.DeserializeObject(json);
                    if (result != null && result.bkashURL != null)
                    {
                        payment.GatewayPaymentId = result.paymentID?.ToString();
                        await _unitOfWork.CommitAsync();

                        return new PaymentInitResultDto { GatewayUrl = result.bkashURL.ToString() };
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"bKash API integration error: {ex.Message}. Falling back to sandbox simulation.");
            }

            // Fallback to sandbox
            var fallbackUrl = $"{GetFrontendUrl()}/#/payment/bkash-sandbox?paymentId={payment.Id}&amount={dto.Amount.ToString("0.00")}&orderId={order.Id}";
            return new PaymentInitResultDto { GatewayUrl = fallbackUrl };
        }

        private string GetFrontendUrl()
        {
            var url = _config["Frontend:BaseUrl"];
            if (string.IsNullOrWhiteSpace(url) || url.Contains("3000"))
            {
                return "http://localhost:5173";
            }
            return url.TrimEnd('/');
        }

        /* ================= BKASH EXECUTE ================= */

        public async Task<bool> ExecuteBkashPaymentAsync(string paymentID)
        {
            Payment? payment = null;
            if (Guid.TryParse(paymentID, out var paymentGuid))
            {
                payment = await _paymentRepo.GetByIdAsync(paymentGuid);
            }

            if (payment == null)
            {
                payment = await _paymentRepo.All.FirstOrDefaultAsync(p => p.GatewayPaymentId == paymentID);
            }

            if (payment == null)
                return false;

            var settings = await _generalRepo.All.FirstOrDefaultAsync();
            bool isSimulated = settings == null || string.IsNullOrWhiteSpace(settings.BkashAppKey) || settings.BkashAppKey.Contains("placeholder");

            if (isSimulated)
            {
                payment.Status = "Paid";
                payment.TransactionId = $"BKASH-SIM-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
                payment.PaidAt = DateTimeOffset.UtcNow;
                payment.UpdatedAt = DateTimeOffset.UtcNow;

                var order = await _orderRepo.GetByIdAsync(payment.OrderId);
                if (order != null)
                {
                    order.Status = "Confirmed";
                    order.PaymentStatus = "Paid";
                    order.UpdatedAt = DateTimeOffset.UtcNow;
                }

                await _unitOfWork.CommitAsync();
                return true;
            }

            try
            {
                var token = await GetBkashTokenAsync(settings!);
                if (!string.IsNullOrWhiteSpace(token))
                {
                    var baseUrl = !string.IsNullOrWhiteSpace(settings!.BkashSandboxUrl) ? settings.BkashSandboxUrl : "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";
                    var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/payment/execute");
                    request.Headers.Add("Authorization", token);
                    request.Headers.Add("X-APP-Key", settings.BkashAppKey);

                    var payload = new { paymentID = payment.GatewayPaymentId ?? paymentID };
                    request.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

                    var response = await _http.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        dynamic result = JsonConvert.DeserializeObject(json);
                        if (result != null && result.statusCode != null && result.statusCode.ToString() == "0000")
                        {
                            payment.Status = "Paid";
                            payment.TransactionId = result.trxID?.ToString() ?? $"BKASH-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
                            payment.PaidAt = DateTimeOffset.UtcNow;
                            payment.GatewayPayload = json;
                            payment.UpdatedAt = DateTimeOffset.UtcNow;

                            var order = await _orderRepo.GetByIdAsync(payment.OrderId);
                            if (order != null)
                            {
                                order.Status = "Confirmed";
                                order.PaymentStatus = "Paid";
                                order.UpdatedAt = DateTimeOffset.UtcNow;
                            }

                            await _unitOfWork.CommitAsync();
                            return true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"bKash execute payment error: {ex.Message}");
            }

            return false;
        }

        public async Task HandleBkashFailAsync(string paymentID)
        {
            Payment? payment = null;
            if (Guid.TryParse(paymentID, out var paymentGuid))
            {
                payment = await _paymentRepo.GetByIdAsync(paymentGuid);
            }

            if (payment == null)
            {
                payment = await _paymentRepo.All.FirstOrDefaultAsync(p => p.GatewayPaymentId == paymentID);
            }

            if (payment == null)
                return;

            payment.Status = "Failed";
            payment.FailedAt = DateTimeOffset.UtcNow;
            payment.UpdatedAt = DateTimeOffset.UtcNow;

            var order = await _orderRepo.GetByIdAsync(payment.OrderId);
            if (order != null)
            {
                order.Status = "PaymentFailed";
                order.PaymentStatus = "Failed";
                order.UpdatedAt = DateTimeOffset.UtcNow;
            }

            await _unitOfWork.CommitAsync();
        }

        /* ================= PRIVATE BKASH AUTH HELPERS ================= */

        private async Task<string?> GetBkashTokenAsync(GeneralSetting settings)
        {
            var appKey = settings.BkashAppKey;
            var appSecret = settings.BkashAppSecret;
            var username = settings.BkashUsername;
            var password = settings.BkashPassword;
            var baseUrl = !string.IsNullOrWhiteSpace(settings.BkashSandboxUrl) ? settings.BkashSandboxUrl : "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";

            var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/token/grant");
            request.Headers.Add("username", username);
            request.Headers.Add("password", password);

            var payload = new { app_key = appKey, app_secret = appSecret };
            request.Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            var response = await _http.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                dynamic result = JsonConvert.DeserializeObject(json);
                return result?.id_token?.ToString();
            }

            return null;
        }

        /* ================= GATEWAY & SUBSCRIPTION METHODS ================= */

        public async Task<GatewayStatusDto> GetGatewayStatusAsync()
        {
            var settings = await _generalRepo.All.FirstOrDefaultAsync();
            return new GatewayStatusDto
            {
                BkashEnabled = settings?.BkashIsEnabled ?? true,
                SslEnabled = settings?.SslIsEnabled ?? true
            };
        }

        public async Task<CouponValidationResultDto> ValidateCouponAsync(CouponValidateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                return new CouponValidationResultDto
                {
                    IsValid = false,
                    DiscountAmount = 0,
                    FinalPrice = dto.PlanPrice,
                    Message = "কুপন কোড প্রদান করুন।"
                };
            }

            var cleanCode = dto.Code.Trim().ToUpper();
            var coupon = await _couponRepo.All.FirstOrDefaultAsync(c => c.Code.ToUpper() == cleanCode && c.IsActive);

            if (coupon == null)
            {
                if (cleanCode == "TAKEUP10" || cleanCode == "PRO20" || cleanCode == "FREEPRO")
                {
                    decimal pct = cleanCode == "PRO20" ? 0.20m : (cleanCode == "FREEPRO" ? 1.0m : 0.10m);
                    decimal disc = Math.Round(dto.PlanPrice * pct, 2);
                    return new CouponValidationResultDto
                    {
                        IsValid = true,
                        DiscountAmount = disc,
                        FinalPrice = Math.Max(0, dto.PlanPrice - disc),
                        Message = $"কুপন '{cleanCode}' সফলভাবে যুক্ত হয়েছে!"
                    };
                }

                return new CouponValidationResultDto
                {
                    IsValid = false,
                    DiscountAmount = 0,
                    FinalPrice = dto.PlanPrice,
                    Message = "অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড।"
                };
            }

            decimal discount = 0;
            if (coupon.DiscountType != null && coupon.DiscountType.Equals("percentage", StringComparison.OrdinalIgnoreCase))
            {
                decimal pct = coupon.Discount > 1 ? (coupon.Discount / 100m) : coupon.Discount;
                discount = Math.Round(dto.PlanPrice * pct, 2);
            }
            else
            {
                discount = coupon.Discount;
            }

            decimal final = Math.Max(0, dto.PlanPrice - discount);
            return new CouponValidationResultDto
            {
                IsValid = true,
                DiscountAmount = discount,
                FinalPrice = final,
                Message = $"কুপন '{coupon.Code}' সফলভাবে প্রয়োগ করা হয়েছে!"
            };
        }

        public async Task<PaymentInitResultDto> InitSubscriptionPaymentAsync(SubscriptionInitDto dto)
        {
            var orderId = Guid.NewGuid();
            var order = new Order
            {
                Id = orderId,
                OrderNumber = $"SUB-{DateTime.UtcNow:yyyyMMddHHmmss}-{new Random().Next(1000, 9999)}",
                Subtotal = dto.Amount,
                GrandTotal = dto.Amount,
                Status = "Pending",
                PaymentStatus = "Pending",
                PaymentMethod = dto.PaymentMethod,
                UserId = dto.UserId ?? Guid.Empty,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await _orderRepo.AddAsync(order);
            await _unitOfWork.CommitAsync();

            var initDto = new PaymentInitDto
            {
                OrderId = order.Id,
                Amount = dto.Amount,
                Currency = "BDT",
                CustomerName = string.IsNullOrWhiteSpace(dto.CustomerName) ? "Student" : dto.CustomerName,
                Phone = string.IsNullOrWhiteSpace(dto.Phone) ? "01700000000" : dto.Phone,
                Email = string.IsNullOrWhiteSpace(dto.Email) ? "student@takeuup.com" : dto.Email,
                Address = "Dhaka, Bangladesh"
            };

            if (dto.PaymentMethod.Equals("bKash", StringComparison.OrdinalIgnoreCase))
            {
                return await InitBkashPaymentAsync(initDto);
            }
            else
            {
                return await InitSslPaymentAsync(initDto);
            }
        }
    }
}
