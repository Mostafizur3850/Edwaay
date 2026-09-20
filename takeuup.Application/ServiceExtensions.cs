using ECommerce.Application.Service;
using ECommerce.Application.Service.HomePageService;
using ECommerce.Application.Service.HomeSliderService;
using ECommerce.Application.Service.MaintenanceService;
using ECommerce.Domain.Repository;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using MediatR;

namespace ECommerce.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection ServiceExtensions(this IServiceCollection services)
        {
            services.AddMediatR(cfg => {
                cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
                cfg.AddOpenBehavior(typeof(Common.ValidationBehavior<,>));
            });
            services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

            services.AddHttpClient<IPaymentService, PaymentService>();
            services.AddHttpClient<ISmsService, SmsService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IBrandService, BrandService>();
            services.AddScoped<IDocumentsInfoService, DocumentsInfoService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<ICategoryService, CategoryService>();       
            services.AddScoped<ICMetaKeywordService, CMetaKeywordService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ISkuGenerator, SkuGenerator>();
            services.AddScoped<ITaxService, TaxService>();
            services.AddScoped<IPMetaKeywordService, PMetaKeywordService>();
            services.AddScoped<IProductTagService, ProductTagService>();
            services.AddScoped<IProductImageService, ProductImageService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IOrderService, OrderService>();     
            services.AddScoped<ICouponService, CouponService>();
            services.AddScoped<IServiceOffcerService, ServiceOffcerService>();
            services.AddScoped<IGeneralSettingService, GeneralSettingService>();
            services.AddScoped<IHomeTopAdService, HomeTopAdService>();
            services.AddScoped<IHomePageService, HomePageService>();
            services.AddScoped<IHomeSliderService, HomeSliderService>();
            services.AddScoped<IMaintenanceService, MaintenanceService>();
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IUserDeliveryAddressService, UserDeliveryAddressService>();
            services.AddScoped<IFaqCategoryService, FaqCategoryService>();
            services.AddScoped<IFaqService, FaqService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IBlogCategoryService, BlogCategoryService>();
            services.AddScoped<IPageService, PageService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IProductPriceRequestService, ProductPriceRequestService>();
           
            return services;
        }
    }
}
