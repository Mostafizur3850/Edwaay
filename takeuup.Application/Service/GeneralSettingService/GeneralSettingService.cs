using ECommerce.Application.DTOs;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Service
{
    public class GeneralSettingService : IGeneralSettingService
    {
        private readonly IBaseRepository<GeneralSetting> _generalRepo;
        private readonly IBaseRepository<SiteMetaKeyword> _keywordRepo;
        private readonly IBaseRepository<MediaSetting> _mediaRepo;
        private readonly IBaseRepository<ContactSetting> _contactRepo;
        private readonly IBaseRepository<SocialLink> _socialRepo;
        private readonly IBaseRepository<WorkingHour> _workingRepo;
        private readonly IFileStorageService _fileStorageService;
        private readonly IUnitOfWork _unitOfWork;

        public GeneralSettingService(
            IBaseRepository<GeneralSetting> generalRepo,
            IBaseRepository<SiteMetaKeyword> keywordRepo,
            IBaseRepository<MediaSetting> mediaRepo,
            IBaseRepository<ContactSetting> contactRepo,
            IBaseRepository<SocialLink> socialRepo,
            IBaseRepository<WorkingHour> workingRepo,
            IFileStorageService fileStorageService,
            IUnitOfWork unitOfWork)
        {
            _generalRepo = generalRepo;
            _keywordRepo = keywordRepo;
            _mediaRepo = mediaRepo;
            _contactRepo = contactRepo;
            _socialRepo = socialRepo;
            _workingRepo = workingRepo;
            _fileStorageService = fileStorageService;
            _unitOfWork = unitOfWork;
        }

        // ========================= GET =========================
        public async Task<GeneralSettingDto> GetAsync()
        {
            var setting = await _generalRepo.All
                .Include(x => x.SiteMetaKeywords)
                .Include(x => x.MediaSetting)
                .Include(x => x.ContactSetting)
                    .ThenInclude(x => x.SocialLinks)
                .Include(x => x.ContactSetting)
                    .ThenInclude(x => x.WorkingHours)
                .FirstOrDefaultAsync();

            // 🔹 First time → safe defaults
            if (setting == null)
            {
                return new GeneralSettingDto
                {
                    AppName = "",
                    HomePageTitle = "",
                    PrimaryColorCode = "#0FABB1",
                    CurrencyDirection = "left",
                    DecimalSeparator = ",",
                    ThousandSeparator = ",",
                    MetaDescription = "",
                    MetaKeywords = new(),
                    StoreAddress = "",
                    StorePhone = "",
                    StoreEmail = "",
                    CopyrightText = "",
                    LogoUrl = "",
                    GatewayImageUrl = "",
                    SocialLinks = new(),
                    WorkingHours = new()
                };
            }

            return new GeneralSettingDto
            {
                Id = setting.Id,
                AppName = setting.AppName,
                HomePageTitle = setting.HomePageTitle,
                PrimaryColorCode = setting.PrimaryColorCode,
                CurrencyDirection = setting.CurrencyDirection,
                DecimalSeparator = setting.DecimalSeparator,
                ThousandSeparator = setting.ThousandSeparator,
                MetaDescription = setting.SiteMetaDescription,
                MetaKeywords = setting.SiteMetaKeywords.Select(x => x.Keyword).ToList(),
                PricingPlansJson = setting.PricingPlansJson,

                SmsApiKey = setting.SmsApiKey ?? "",
                SmsSecretKey = setting.SmsSecretKey ?? "",
                SmsCallerId = setting.SmsCallerId ?? "",
                SmsIsEnabled = setting.SmsIsEnabled,
                SmsUseMasking = setting.SmsUseMasking,

                SslStoreId = setting.SslStoreId ?? "",
                SslStorePassword = setting.SslStorePassword ?? "",
                SslSandboxUrl = setting.SslSandboxUrl ?? "",
                SslIsEnabled = setting.SslIsEnabled,

                BkashAppKey = setting.BkashAppKey ?? "",
                BkashAppSecret = setting.BkashAppSecret ?? "",
                BkashUsername = setting.BkashUsername ?? "",
                BkashPassword = setting.BkashPassword ?? "",
                BkashSandboxUrl = setting.BkashSandboxUrl ?? "",
                BkashIsEnabled = setting.BkashIsEnabled,

                SmtpHost = setting.SmtpHost ?? "smtp.gmail.com",
                SmtpPort = setting.SmtpPort,
                SmtpEmail = setting.SmtpEmail ?? "",
                SmtpPassword = setting.SmtpPassword ?? "",
                SmtpIsEnabled = setting.SmtpIsEnabled,

                LogoUrl = setting.MediaSetting?.LogoPath ?? "",
                GatewayImageUrl = setting.ContactSetting?.GatewayImagePath ?? "",

                StoreAddress = setting.ContactSetting?.StoreAddress ?? "",
                StorePhone = setting.ContactSetting?.StorePhone ?? "",
                StoreEmail = setting.ContactSetting?.StoreEmail ?? "",
                CopyrightText = setting.ContactSetting?.CopyrightText ?? "",

                SocialLinks = setting.ContactSetting?.SocialLinks
                    .Select(x => new SocialLinkDto
                    {
                        IconName = x.IconName,
                        Url = x.Url
                    }).ToList() ?? new(),

                WorkingHours = setting.ContactSetting?.WorkingHours
                    .Select(x => new WorkingHourDto
                    {
                        DayType = x.DayType,
                        FromTime = x.FromTime.ToString(),
                        ToTime = x.ToTime.ToString(),
                    }).ToList() ?? new()
            };
        }

        // ========================= UPDATE =========================
        public async Task UpdateAsync(GeneralSettingUpdateDto dto)
        {
            var setting = await _generalRepo.All
                .Include(x => x.SiteMetaKeywords)
                .Include(x => x.MediaSetting)
                .Include(x => x.ContactSetting)
                    .ThenInclude(x => x.SocialLinks)
                .Include(x => x.ContactSetting)
                    .ThenInclude(x => x.WorkingHours)
                .FirstOrDefaultAsync();

            // 🔹 First time create
            if (setting == null)
            {
                setting = new GeneralSetting
                {
                    Id = Guid.NewGuid(),
                    AppName = "",
                    HomePageTitle = "",
                    PrimaryColorCode = "#0FABB1",
                    CurrencyDirection = "left",
                    DecimalSeparator = ",",
                    ThousandSeparator = ",",
                    SiteMetaDescription = "",
                    CreatedAt = DateTimeOffset.UtcNow
                };

                await _generalRepo.AddAsync(setting);
            }

            // ---------- BASIC ----------
            if (dto.AppName != null) setting.AppName = dto.AppName;
            if (dto.HomePageTitle != null) setting.HomePageTitle = dto.HomePageTitle;
            if (dto.PrimaryColorCode != null) setting.PrimaryColorCode = dto.PrimaryColorCode;
            if (dto.CurrencyDirection != null) setting.CurrencyDirection = dto.CurrencyDirection;
            if (dto.DecimalSeparator != null) setting.DecimalSeparator = dto.DecimalSeparator;
            if (dto.ThousandSeparator != null) setting.ThousandSeparator = dto.ThousandSeparator;
            if (dto.MetaDescription != null) setting.SiteMetaDescription = dto.MetaDescription;
            if (dto.PricingPlansJson != null) setting.PricingPlansJson = dto.PricingPlansJson;

            // ---------- SMS ----------
            if (dto.SmsApiKey != null) setting.SmsApiKey = dto.SmsApiKey;
            if (dto.SmsSecretKey != null) setting.SmsSecretKey = dto.SmsSecretKey;
            if (dto.SmsCallerId != null) setting.SmsCallerId = dto.SmsCallerId;
            if (dto.SmsIsEnabled != null) setting.SmsIsEnabled = dto.SmsIsEnabled.Value;
            if (dto.SmsUseMasking != null) setting.SmsUseMasking = dto.SmsUseMasking.Value;

            // ---------- SSLCOMMERZ ----------
            if (dto.SslStoreId != null) setting.SslStoreId = dto.SslStoreId;
            if (dto.SslStorePassword != null) setting.SslStorePassword = dto.SslStorePassword;
            if (dto.SslSandboxUrl != null) setting.SslSandboxUrl = dto.SslSandboxUrl;
            if (dto.SslIsEnabled != null) setting.SslIsEnabled = dto.SslIsEnabled.Value;

            // ---------- BKASH ----------
            if (dto.BkashAppKey != null) setting.BkashAppKey = dto.BkashAppKey;
            if (dto.BkashAppSecret != null) setting.BkashAppSecret = dto.BkashAppSecret;
            if (dto.BkashUsername != null) setting.BkashUsername = dto.BkashUsername;
            if (dto.BkashPassword != null) setting.BkashPassword = dto.BkashPassword;
            if (dto.BkashSandboxUrl != null) setting.BkashSandboxUrl = dto.BkashSandboxUrl;
            if (dto.BkashIsEnabled != null) setting.BkashIsEnabled = dto.BkashIsEnabled.Value;

            // ---------- SMTP ----------
            if (dto.SmtpHost != null) setting.SmtpHost = dto.SmtpHost;
            if (dto.SmtpPort != null) setting.SmtpPort = dto.SmtpPort.Value;
            if (dto.SmtpEmail != null) setting.SmtpEmail = dto.SmtpEmail;
            if (dto.SmtpPassword != null) setting.SmtpPassword = dto.SmtpPassword;
            if (dto.SmtpIsEnabled != null) setting.SmtpIsEnabled = dto.SmtpIsEnabled.Value;

            // ---------- META KEYWORDS ----------
            if (dto.MetaKeywords != null)
            {
                foreach (var old in setting.SiteMetaKeywords.ToList())
                    _keywordRepo.Remove(old);

                foreach (var keyword in dto.MetaKeywords)
                {
                    await _keywordRepo.AddAsync(new SiteMetaKeyword
                    {
                        Id = Guid.NewGuid(),
                        Keyword = keyword,
                        GeneralSettingId = setting.Id
                    });
                }
            }

            // ---------- MEDIA (LOGO) ----------
            if (dto.LogoFile != null)
            {
                if (setting.MediaSetting == null)
                {
                    setting.MediaSetting = new MediaSetting
                    {
                        Id = Guid.NewGuid(),
                        GeneralSettingId = setting.Id
                    };
                    await _mediaRepo.AddAsync(setting.MediaSetting);
                }

                await _fileStorageService.DeletePrevFilesAsync(
                    EnumDocType.GeneralSetting,
                    "Logo",
                    setting.Id,
                    CancellationToken.None);

                var uploaded = await _fileStorageService.UploadImageAsync(
                    new FormFileCollection { dto.LogoFile },
                    "Logo",
                    setting.Id,
                    "logo_",
                    CancellationToken.None);

                setting.MediaSetting.LogoPath = uploaded.First().DocPath;
            }

            // ---------- CONTACT ----------
            if (setting.ContactSetting == null)
            {
                setting.ContactSetting = new ContactSetting
                {
                    Id = Guid.NewGuid(),
                    GeneralSettingId = setting.Id,
                    StoreAddress = "",
                    StorePhone = "",
                    StoreEmail = "",
                    GatewayImagePath = "",
                    CopyrightText = "",
                    LogoPath = ""
                };
                await _contactRepo.AddAsync(setting.ContactSetting);
            }

            if (dto.StoreAddress != null) setting.ContactSetting.StoreAddress = dto.StoreAddress;
            if (dto.StorePhone != null) setting.ContactSetting.StorePhone = dto.StorePhone;
            if (dto.StoreEmail != null) setting.ContactSetting.StoreEmail = dto.StoreEmail;
            if (dto.CopyrightText != null) setting.ContactSetting.CopyrightText = dto.CopyrightText;

            // ---------- GATEWAY IMAGE ----------
            if (dto.GatewayImageFile != null)
            {
                await _fileStorageService.DeletePrevFilesAsync(
                    EnumDocType.GeneralSetting,
                    "Gateway",
                    setting.Id,
                    CancellationToken.None);

                var uploaded = await _fileStorageService.UploadImageAsync(
                    new FormFileCollection { dto.GatewayImageFile },
                    "Gateway",
                    setting.Id,
                    "gateway_",
                    CancellationToken.None);

                setting.ContactSetting.GatewayImagePath = uploaded.First().DocPath;
            }

            // ---------- SOCIAL LINKS ----------
            if (dto.SocialLinks != null)
            {
                foreach (var old in setting.ContactSetting.SocialLinks.ToList())
                    _socialRepo.Remove(old);

                foreach (var s in dto.SocialLinks)
                {
                    await _socialRepo.AddAsync(new SocialLink
                    {
                        Id = Guid.NewGuid(),
                        IconName = s.IconName,
                        Url = s.Url,
                        ContactSettingId = setting.ContactSetting.Id
                    });
                }
            }

            // ---------- WORKING HOURS ----------
            if (dto.WorkingHours != null)
            {
                foreach (var old in setting.ContactSetting.WorkingHours.ToList())
                    _workingRepo.Remove(old);

                foreach (var w in dto.WorkingHours)
                {
                    await _workingRepo.AddAsync(new WorkingHour
                    {
                        Id = Guid.NewGuid(),
                        DayType = w.DayType,
                        FromTime = TimeSpan.Parse(w.FromTime),
                        ToTime = TimeSpan.Parse(w.ToTime),
                        ContactSettingId = setting.ContactSetting.Id
                    });
                }
            }

            setting.UpdatedAt = DateTimeOffset.UtcNow;
            await _unitOfWork.CommitAsync();
        }
    }
}
