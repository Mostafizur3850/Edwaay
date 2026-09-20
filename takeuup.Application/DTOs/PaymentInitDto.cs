using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class PaymentInitDto
    {
        [Required]
        public Guid OrderId { get; set; }   // কোন order এর payment

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Currency { get; set; } = "SSLCommerz";

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        // optional but recommended
        public string? Address { get; set; }
    }


    public class SslCallbackDto
    {
        /* ================= BASIC ================= */

        [FromForm(Name = "tran_id")]
        [Required]
        public string tran_id { get; set; } = default!;
        // our payment.Id (GUID as string)

        [FromForm(Name = "status")]
        public string status { get; set; } = default!;
        // VALID | FAILED | CANCELLED

        [FromForm(Name = "amount")]
        public decimal amount { get; set; }

        [FromForm(Name = "currency")]
        public string currency { get; set; } = "BDT";

        /* ================= TRANSACTION ================= */

        [FromForm(Name = "bank_tran_id")]
        public string? bank_tran_id { get; set; }

        [FromForm(Name = "tran_date")]
        public string? tran_date { get; set; }

        [FromForm(Name = "card_type")]
        public string? card_type { get; set; }

        [FromForm(Name = "card_no")]
        public string? card_no { get; set; }

        [FromForm(Name = "card_issuer")]
        public string? card_issuer { get; set; }

        [FromForm(Name = "card_brand")]
        public string? card_brand { get; set; }

        [FromForm(Name = "card_issuer_country")]
        public string? card_issuer_country { get; set; }

        /* ================= SECURITY ================= */

        [FromForm(Name = "val_id")]
        public string? val_id { get; set; }

        [FromForm(Name = "verify_sign")]
        public string? verify_sign { get; set; }

        [FromForm(Name = "verify_key")]
        public string? verify_key { get; set; }

        /* ================= CUSTOMER ================= */

        [FromForm(Name = "cus_name")]
        public string? cus_name { get; set; }

        [FromForm(Name = "cus_email")]
        public string? cus_email { get; set; }

        [FromForm(Name = "cus_phone")]
        public string? cus_phone { get; set; }

        /* ================= META ================= */

        [FromForm(Name = "error")]
        public string? error { get; set; }
    }

    public class PaymentInitResultDto
    {
        public string GatewayUrl { get; set; } = default!;
    }

    public class GatewayStatusDto
    {
        public bool BkashEnabled { get; set; }
        public bool SslEnabled { get; set; }
    }

    public class SubscriptionInitDto
    {
        public string PlanName { get; set; } = "6 Months";
        public int DurationMonths { get; set; } = 6;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "bKash"; // "bKash" or "SSL"
        public string? CouponCode { get; set; }
        public string CustomerName { get; set; } = "Student";
        public string Phone { get; set; } = "";
        public string Email { get; set; } = "";
        public Guid? UserId { get; set; }
    }

    public class CouponValidateDto
    {
        public string Code { get; set; } = "";
        public decimal PlanPrice { get; set; }
    }

    public class CouponValidationResultDto
    {
        public bool IsValid { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalPrice { get; set; }
        public string Message { get; set; } = "";
    }
}
