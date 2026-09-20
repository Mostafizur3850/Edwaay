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
    public interface IPaymentService
    {
        Task<PaymentInitResultDto> InitSslPaymentAsync(PaymentInitDto dto);
        Task HandleSslSuccessAsync(SslCallbackDto dto);
        Task HandleSslFailAsync(SslCallbackDto dto);

        Task<PaymentInitResultDto> InitBkashPaymentAsync(PaymentInitDto dto);
        Task<bool> ExecuteBkashPaymentAsync(string paymentID);
        Task HandleBkashFailAsync(string paymentID);

        Task<GatewayStatusDto> GetGatewayStatusAsync();
        Task<CouponValidationResultDto> ValidateCouponAsync(CouponValidateDto dto);
        Task<PaymentInitResultDto> InitSubscriptionPaymentAsync(SubscriptionInitDto dto);
    }
}
