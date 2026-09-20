using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{

    public class GeneralSetting : BaseEntity
    {
        public string AppName { get; set; } = "";
        public string HomePageTitle { get; set; } = "";
        public string PrimaryColorCode { get; set; } = "";

        public string CurrencyDirection { get; set; } = "left";
        public string DecimalSeparator { get; set; } = ",";
        public string ThousandSeparator { get; set; } = ",";

        // 🔥 THIS IS THE KEY
        public string SiteMetaDescription { get; set; } = "";

        // Navigation
        public ICollection<SiteMetaKeyword> SiteMetaKeywords { get; set; } = new List<SiteMetaKeyword>();
        public MediaSetting MediaSetting { get; set; } = null!;
        public ContactSetting ContactSetting { get; set; } = null!;

        public string? PricingPlansJson { get; set; }

        // SMS Gateway Settings
        public string? SmsApiKey { get; set; }
        public string? SmsSecretKey { get; set; }
        public string? SmsCallerId { get; set; }
        public bool SmsIsEnabled { get; set; } = false;
        public bool SmsUseMasking { get; set; } = false;

        // SSLCommerz Settings
        public string? SslStoreId { get; set; }
        public string? SslStorePassword { get; set; }
        public string? SslSandboxUrl { get; set; }
        public bool SslIsEnabled { get; set; } = false;

        // bKash Settings
        public string? BkashAppKey { get; set; }
        public string? BkashAppSecret { get; set; }
        public string? BkashUsername { get; set; }
        public string? BkashPassword { get; set; }
        public string? BkashSandboxUrl { get; set; }
        public bool BkashIsEnabled { get; set; } = false;

        // SMTP Email Settings
        public string? SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string? SmtpEmail { get; set; }
        public string? SmtpPassword { get; set; }
        public bool SmtpIsEnabled { get; set; } = false;
    }



}
