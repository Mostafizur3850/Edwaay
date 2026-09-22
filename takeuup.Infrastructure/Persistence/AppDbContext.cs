using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace ECommerce.Infrastructure;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public virtual async Task<int> CommitAsync()
    {
        try
        {
            return await base.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            var fullErrorMessage = string.Join("; ", ex.InnerException?.Message);
            var exceptionMessage = string.Concat(ex.Message, " The validation errors are: ", fullErrorMessage);
            throw new Exception(exceptionMessage, ex);
        }
    }

    #region Authentication and Authorization
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();  
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<ApplicationRoleMenu> ApplicationRoleMenus => Set<ApplicationRoleMenu>();
    public DbSet<RoleMenuPermission> RoleMenuPermissions => Set<RoleMenuPermission>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<DocumentsInfo> documentsInfos => Set<DocumentsInfo>();

    #endregion

    #region ECommerce Domain Entities

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<AttributeDefinition> AttributeDefinitions => Set<AttributeDefinition>();
    public DbSet<AttributeOption> AttributeOptions => Set<AttributeOption>();
    public DbSet<ProductVariantOption> ProductVariantOptions => Set<ProductVariantOption>();
    public DbSet<ProductAttributeValue> ProductAttributeValues => Set<ProductAttributeValue>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventCategory> EventCategories => Set<EventCategory>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PaymentTransaction> paymentTransactions => Set<PaymentTransaction>();
    public DbSet<PaymentLog> paymentLogs => Set<PaymentLog>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ErrorLog> ErrorLogs => Set<ErrorLog>();
    public DbSet<ServiceOffer> serviceOffers => Set<ServiceOffer>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<CategoryMetaKeyword> categoryMetaKeywords => Set<CategoryMetaKeyword>();
    public DbSet<ProductMetaKeyword> productMetaKeywords => Set<ProductMetaKeyword>();
    public DbSet<ProductTag> productTags => Set<ProductTag>();
    public DbSet<GeneralSetting> generalSettings => Set<GeneralSetting>();
    public DbSet<ContactSetting> contactSettings => Set<ContactSetting>();
    public DbSet<MediaSetting> mediaSettings => Set<MediaSetting>();
    public DbSet<SiteMetaKeyword> siteMetaKeywords => Set<SiteMetaKeyword>();
    public DbSet<SocialLink> socialLinks => Set<SocialLink>();
    public DbSet<WorkingHour>  workingHours => Set<WorkingHour>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<Faq> faqs => Set<Faq>();
    public DbSet<FaqCategory> faqCategories => Set<FaqCategory>();
    public DbSet<Blog > blogs => Set<Blog>();
    public DbSet<BlogCategory > blogCategories => Set<BlogCategory>();
    public DbSet<BlogTag > blogTags => Set<BlogTag>();
    public DbSet<BlogMetaKeyword >  blogMetaKeywords => Set<BlogMetaKeyword>();
    public DbSet<OrderAddress >  orderAddresses => Set<OrderAddress>();
    public DbSet<HeroSideBanner> heroSideBanners => Set<HeroSideBanner>();
    public DbSet<HomePopularCategoryItem> homePopularCategoryItems => Set<HomePopularCategoryItem>(); 
    public DbSet<HomePopularCategorySection> homePopularCategorySections => Set<HomePopularCategorySection>(); 
    public DbSet<HomeThreeColumnItem> homeThreeColumnItems => Set<HomeThreeColumnItem>(); 
    public DbSet<HomeThreeColumnSection> homeThreeColumnSections => Set<HomeThreeColumnSection>(); 
    public DbSet<HomeTopAd> homeTopAds => Set<HomeTopAd>(); 
    public DbSet<HomeSlider> homeSliders => Set<HomeSlider>(); 
    public DbSet<MaintenanceSetting> maintenanceSettings => Set<MaintenanceSetting>(); 
    public DbSet<UserProfile> userProfiles => Set<UserProfile>(); 
    public DbSet<UserDeliveryAddress> userDeliveryAddresses => Set<UserDeliveryAddress>(); 
    public DbSet<HomeHeroBanner> homeHeroBanners => Set<HomeHeroBanner>(); 
    public DbSet<Page> pages => Set<Page>(); 
    public DbSet<ProductQuestion> productQuestions => Set<ProductQuestion>(); 
    public DbSet<ProductPriceRequest> productPriceRequests => Set<ProductPriceRequest>(); 

    // TakeUUp custom domain entities
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<UserQuizResult> UserQuizResults => Set<UserQuizResult>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<UserResume> UserResumes => Set<UserResume>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<JobCategory> JobCategories => Set<JobCategory>();
    public DbSet<Mentor> Mentors => Set<Mentor>();
    public DbSet<QuizCategory> QuizCategories => Set<QuizCategory>();
    public DbSet<QuizSubject> QuizSubjects => Set<QuizSubject>();
    public DbSet<TeacherInvitation> TeacherInvitations => Set<TeacherInvitation>();
    public DbSet<OtpVerification> OtpVerifications => Set<OtpVerification>();
    public DbSet<AboutUsMember> AboutUsMembers => Set<AboutUsMember>();
    public DbSet<AboutUsSettings> AboutUsSettings => Set<AboutUsSettings>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<GoalCategory> GoalCategories => Set<GoalCategory>();
    public DbSet<GoalChangeRequest> GoalChangeRequests => Set<GoalChangeRequest>();
        public DbSet<News> News => Set<News>();
    public DbSet<CurrentAffairQuestion> CurrentAffairQuestions => Set<CurrentAffairQuestion>();
    public DbSet<Notification> Notifications => Set<Notification>();

    #endregion



    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<RefreshToken>(b =>
        {
            b.HasIndex(x => x.Token).IsUnique();
            b.Property(x => x.Token).HasMaxLength(256);
        });

        //builder.Entity<ApplicationUser>(b =>
        //{
        //    b.Property(x => x.UserNo).ValueGeneratedOnAdd();
        //    b.HasIndex(x => x.UserNo).IsUnique();
        //});

        builder.Entity<ApplicationUser>(b =>
        {
            b.Property(x => x.UserNo)
                .UseIdentityColumn()
                .ValueGeneratedOnAdd();           
            b.Property(x => x.UserNo).Metadata.SetBeforeSaveBehavior(Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore);
            b.Property(x => x.UserNo).Metadata.SetAfterSaveBehavior(Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore);
            b.HasIndex(x => x.UserNo).IsUnique();
        });

        builder.Entity<Category>()
            .HasMany(x => x.Children)
            .WithOne(x => x.Parent)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Product>()
            .HasIndex(x => x.Slug)
            .IsUnique();

        builder.Entity<ProductVariant>()
           .HasIndex(x => x.Sku)
           .IsUnique();

        builder.Entity<ProductVariantOption>()
            .HasKey(x => new { x.VariantId, x.AttributeDefinitionId });


        builder.Entity<ProductVariantOption>()
           .HasOne(x => x.Variant)
           .WithMany(x => x.Options)
           .HasForeignKey(x => x.VariantId);


        builder.Entity<ProductVariantOption>()
           .HasOne(x => x.AttributeDefinition)
           .WithMany()
           .HasForeignKey(x => x.AttributeDefinitionId);

        builder.Entity<CartItem>()
          .Property(x => x.UnitPrice)
          .HasPrecision(18, 2);

        builder.Entity<Order>()
          .Property(x => x.Discount)
          .HasPrecision(18, 2);

        builder.Entity<ProductVariantOption>()
            .HasOne(x => x.AttributeOption)
            .WithMany()
            .HasForeignKey(x => x.AttributeOptionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ProductAttributeValue>()
          .HasKey(x => new { x.ProductId, x.AttributeDefinitionId });

        builder.Entity<ProductAttributeValue>()
          .HasKey(x => new { x.ProductId, x.AttributeDefinitionId });

        builder.Entity<Order>()
           .HasOne(x => x.Payment)
           .WithOne(x => x.Order)
           .HasForeignKey<Payment>(x => x.OrderId);


        builder.Entity<Order>()
           .HasOne(x => x.Shipment)
           .WithOne(x => x.Order)
           .HasForeignKey<Shipment>(x => x.OrderId);


        builder.ApplyConfiguration(new MenuItemConfiguration());
        builder.ApplyConfiguration(new RoleMenuConfiguration());
        builder.ApplyConfiguration(new RoleMenuPermissionConfiguration());
        builder.ApplyConfiguration(new PermissionConfiguration());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var e in ChangeTracker.Entries<BaseEntity>())
        {
            if (e.State == EntityState.Modified)
                e.Entity.UpdatedAt = DateTimeOffset.UtcNow;
        }
        return base.SaveChangesAsync(cancellationToken);

    }
}
