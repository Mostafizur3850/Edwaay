using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/payment")]
[Route("api/payment/ssl")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IConfiguration _config;

    public PaymentController(
        IPaymentService paymentService,
        IConfiguration config)
    {
        _paymentService = paymentService;
        _config = config;
    }

    /* ================= GATEWAYS & SUBSCRIPTION ================= */

    [AllowAnonymous]
    [HttpGet("gateways")]
    public async Task<IActionResult> GetGateways()
    {
        var result = await _paymentService.GetGatewayStatusAsync();
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("init-subscription")]
    public async Task<IActionResult> InitSubscription([FromBody] SubscriptionInitDto dto)
    {
        var result = await _paymentService.InitSubscriptionPaymentAsync(dto);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("validate-coupon")]
    public async Task<IActionResult> ValidateCoupon([FromBody] CouponValidateDto dto)
    {
        var result = await _paymentService.ValidateCouponAsync(dto);
        return Ok(result);
    }

    /* ================= CALLBACKS ================= */

    [AllowAnonymous]
    [HttpPost("success")]
    public async Task<IActionResult> Success([FromForm] SslCallbackDto dto)
    {
        await _paymentService.HandleSslSuccessAsync(dto);

        var frontendBaseUrl = GetFrontendBaseUrl();
        return Redirect($"{frontendBaseUrl}/#/payment/success");
    }

    [AllowAnonymous]
    [HttpPost("fail")]
    public async Task<IActionResult> Fail([FromForm] SslCallbackDto dto)
    {
        await _paymentService.HandleSslFailAsync(dto);

        var frontendBaseUrl = GetFrontendBaseUrl();
        return Redirect($"{frontendBaseUrl}/#/payment/failed");
    }

    [AllowAnonymous]
    [HttpPost("cancel")]
    public IActionResult Cancel()
    {
        var frontendBaseUrl = GetFrontendBaseUrl();
        return Redirect($"{frontendBaseUrl}/#/payment/cancelled");
    }

    [AllowAnonymous]
    [HttpGet("bkash/callback")]
    public async Task<IActionResult> BkashCallback([FromQuery] string paymentID, [FromQuery] string status)
    {
        var frontendBaseUrl = GetFrontendBaseUrl();
        if (status == "success" || status == "SUCCESS")
        {
            var success = await _paymentService.ExecuteBkashPaymentAsync(paymentID);
            if (success)
            {
                return Redirect($"{frontendBaseUrl}/#/payment/success");
            }
        }

        await _paymentService.HandleBkashFailAsync(paymentID);
        return Redirect($"{frontendBaseUrl}/#/payment/failed");
    }

    private string GetFrontendBaseUrl()
    {
        var url = _config["Frontend:BaseUrl"];
        if (string.IsNullOrWhiteSpace(url) || url.Contains("3000"))
        {
            return "http://localhost:5173";
        }
        return url.TrimEnd('/');
    }
}
