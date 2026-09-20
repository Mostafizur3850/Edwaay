using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class GeneralSettingDto
    {
        public Guid Id { get; set; }

        // -------- BASIC --------
        public string AppName { get; set; } = "";
        public string HomePageTitle { get; set; } = "";
        public string PrimaryColorCode { get; set; } = "";
        public string CurrencyDirection { get; set; } = "";
        public string DecimalSeparator { get; set; } = "";
        public string ThousandSeparator { get; set; } = "";

        // -------- SEO --------
        public string MetaDescription { get; set; } = "";
        public List<string> MetaKeywords { get; set; } = new();

        // -------- MEDIA --------
        public string LogoUrl { get; set; } = "";
        public string GatewayImageUrl { get; set; } = "";

        // -------- FOOTER / CONTACT --------
        public string StoreAddress { get; set; } = "";
        public string StorePhone { get; set; } = "";
        public string StoreEmail { get; set; } = "";
        public string CopyrightText { get; set; } = "";

        // ✅ MISSING PARTS (FIX)
        public List<SocialLinkDto> SocialLinks { get; set; } = new();
        public List<WorkingHourDto> WorkingHours { get; set; } = new();
        public string? PricingPlansJson { get; set; }

        // SMS Settings
        public string SmsApiKey { get; set; } = "";
        public string SmsSecretKey { get; set; } = "";
        public string SmsCallerId { get; set; } = "";
        public bool SmsIsEnabled { get; set; }
        public bool SmsUseMasking { get; set; }

        // SSLCommerz Settings
        public string SslStoreId { get; set; } = "";
        public string SslStorePassword { get; set; } = "";
        public string SslSandboxUrl { get; set; } = "";
        public bool SslIsEnabled { get; set; }

        // bKash Settings
        public string BkashAppKey { get; set; } = "";
        public string BkashAppSecret { get; set; } = "";
        public string BkashUsername { get; set; } = "";
        public string BkashPassword { get; set; } = "";
        public string BkashSandboxUrl { get; set; } = "";
        public bool BkashIsEnabled { get; set; }

        // SMTP Settings
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string SmtpEmail { get; set; } = "";
        public string SmtpPassword { get; set; } = "";
        public bool SmtpIsEnabled { get; set; }
    }


       public class GeneralSettingUpdateDto
    {
        public Guid Id { get; set; }

        // BASIC
        public string? AppName { get; set; }
        public string? HomePageTitle { get; set; }
        public string? PrimaryColorCode { get; set; }
        public string? CurrencyDirection { get; set; }
        public string? DecimalSeparator { get; set; }
        public string? ThousandSeparator { get; set; }

        // SEO
        public string? MetaDescription { get; set; }
        public List<string>? MetaKeywords { get; set; }

        // MEDIA
        public IFormFile? LogoFile { get; set; }
        public IFormFile? GatewayImageFile { get; set; }

        // FOOTER
        public string? StoreAddress { get; set; }
        public string? StorePhone { get; set; }
        public string? StoreEmail { get; set; }
        public string? CopyrightText { get; set; }

        // SOCIAL & WORKING
        public List<SocialLinkDto>? SocialLinks { get; set; }
        public List<WorkingHourDto>? WorkingHours { get; set; }
        public string? PricingPlansJson { get; set; }

        // SMS Settings
        public string? SmsApiKey { get; set; }
        public string? SmsSecretKey { get; set; }
        public string? SmsCallerId { get; set; }
        public bool? SmsIsEnabled { get; set; }
        public bool? SmsUseMasking { get; set; }

        // SSLCommerz Settings
        public string? SslStoreId { get; set; }
        public string? SslStorePassword { get; set; }
        public string? SslSandboxUrl { get; set; }
        public bool? SslIsEnabled { get; set; }

        // bKash Settings
        public string? BkashAppKey { get; set; }
        public string? BkashAppSecret { get; set; }
        public string? BkashUsername { get; set; }
        public string? BkashPassword { get; set; }
        public string? BkashSandboxUrl { get; set; }
        public bool? BkashIsEnabled { get; set; }

        // SMTP Settings
        public string? SmtpHost { get; set; }
        public int? SmtpPort { get; set; }
        public string? SmtpEmail { get; set; }
        public string? SmtpPassword { get; set; }
        public bool? SmtpIsEnabled { get; set; }
    }


    public class SocialLinkUpdateDto
    {
        public string IconName { get; set; } = null!;
        public string Url { get; set; } = null!;
    }


    public class WorkingHourUpdateDto
    {
        public string DayType { get; set; } = null!; // weekday / weekend
        public TimeSpan FromTime { get; set;}
        public TimeSpan ToTime { get; set; }
    }

    public class SocialLinkDto
    {
        public string IconName { get; set; } = "";
        public string Url { get; set; } = "";
    }


    public class WorkingHourDto
    {
        public string DayType { get; set; } = ""; // weekday / weekend
        public string FromTime { get; set; } = ""; // "09:00"
        public string ToTime { get; set; } = "";   // "18:00"
    }
}
