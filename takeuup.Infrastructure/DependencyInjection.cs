using ECommerce.Application.Service;
using ECommerce.Domain.Repository;
using ECommerce.Infrastructure.Repository;
using ECommerce.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IProductQueryService, ProductQueryService>();
        services.AddScoped<IProductAdminService, ProductAdminService>();
        services.AddScoped<IProductVariantService, ProductVariantService>();
        services.AddScoped<IProductImageService, ProductImageService>();

        services.AddScoped<ICategoryQueryService, CategoryQueryService>();
        services.AddScoped<ICategoryAdminService, CategoryAdminService>();
        services.AddScoped<IBrandQueryService, BrandQueryService>();
        services.AddScoped<IBrandAdminService, BrandAdminService>();

        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IInventoryService, InventoryService>();
        services.AddScoped<IVendorProductService, VendorProductService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IRoleWiseMenuService, RoleWiseMenuService>();

        services.AddSingleton<ECommerce.Domain.Events.IEventBus, Messaging.InMemoryEventBus>();
        services.AddHostedService<Messaging.EventBusBackgroundWorker>();

        return services;
    }
}
