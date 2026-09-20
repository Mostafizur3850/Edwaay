using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{

    public class CategoryProductFilterDto
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public List<string>? Brands { get; set; }
        public string? SortBy { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? Search { get; set; }
        public string? SortDirection { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool UserRole { get; set; }=false;
    }

    public class CreateProductDto
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string PartNumber { get; set; }
        public decimal Price { get; set; }
        public decimal PreviousPrice { get; set; }
        public int Stock { get; set; }
        public string Sku { get; set; }
        public string? PriceStatus { get; set; } = "Visible";

        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public Guid? TaxId { get; set; }

        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string MetaDescription { get; set; }
        public string? VideoLink { get; set; }

        public List<string> ProductTags { get; set; }
        public List<string> MetaKeywords { get; set; }

        //public IFormFile? FeatureImage { get; set; }
        public IFormFileCollection? FeatureImage { get; set; }
        public IFormFileCollection? GalleryImages { get; set; }
        //public List<IFormFileCollection>? GalleryImages { get; set; }
    }



    public sealed record UpdateProductDto(
    Guid Id,
    string Name,
    string Slug,
    string PartNumber,
    string? ShortDescription,
    string? Description,
    Guid CategoryId,
    Guid? BrandId,
    Guid? TaxId,

    // SEO
    string? MetaTitle,
    string? MetaDescription,

    // Variant
    decimal Price,
    decimal? PreviousPrice,
    int Stock,
    string Sku,
    bool IsPublished,
    string VideoLink,
    List<string> MetaKeywords,
    List<string> ProductTags,
    IFormFileCollection? FeatureImage,
    IFormFileCollection? GalleryImages,
    List<string>? RemovedGalleryImages,
    string? PriceStatus = "Visible"
);


    public sealed record ProductResponseDto(
    Guid Id,
    string Name,
    string Slug,
    string PartNumber,
    string? ShortDescription,
    string? Description,
    Guid CategoryId,
    Guid? BrandId,
    decimal Price,
    decimal? OldPrice,
    int Stock,
    bool IsPublished,
    List<ProductImageDto> Images,
    List<ProductMetaKeyword> MetaKeywords,
    List<ProductTag> ProductTags
);


    //    public sealed record ProductImageDto(
    //    string Url,
    //    bool IsPrimary
    //);


    public sealed record ProductImageDto(
    Guid Id,
    string Url,
    int SortOrder,
    bool IsPrimary
);


    public sealed record ProductDto(
        Guid Id,
        string Name,
        string Slug,
        string? Description,
        string Currency,
        bool IsPublished,
        string? BrandName,
        string CategoryName
    );
    public sealed record ProductQuery(
        int Page = 1,
        int PageSize = 20,
        string? Q = null,
        Guid? CategoryId = null,
        Guid? BrandId = null,
        decimal? MinPrice = null,
        decimal? MaxPrice = null,
        bool? InStock = null,
        string? Sort = "relevance" // relevance|price_asc|price_desc|newest|popular
    );

    public sealed record ProductListItemDto(
        Guid Id,
        string Name,
        string Slug,
        decimal PriceFrom,
        string Currency,
        bool InStock,
        string? ThumbnailUrl,
        string? Brand,
        string? Category
    );

    public sealed record ProductVariantDto(
     Guid id,
     string sku,
     decimal price,
     decimal? oldPrice,
     int stock,
     bool isActive
   
 );




    public sealed record ProductDetailsDto(
        Guid Id,
        string Name,
        string Slug,
        string? Description,
        string Currency,
        bool IsPublished,
        string? Brand,
        string? Category,
        IReadOnlyList<ProductVariantDto> Variants,
        IReadOnlyList<ProductImageDto> Images,
        double RatingAvg,
        long RatingCount
    );

    public sealed record CreateProductRequest(
        string Name,
        string? Description,
        Guid CategoryId,
        Guid? BrandId,
        string Currency = "BDT",
        bool IsPublished = false
    );

    public sealed record UpdateProductRequest(
        string Name,
        string? Description,
        Guid CategoryId,
        Guid? BrandId,
        string Currency = "BDT",
        bool IsPublished = false
    );


    public class ProductVariantCreateDto
    {
        [Required]
        public Guid ProductId { get; set; }   

        [Required]
        [MaxLength(100)]
        public string Sku { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class ProductVariantUpdateDto
    {
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        public bool IsActive { get; set; }
    }

    public sealed record PublishRequest(bool IsPublished);
    public sealed record BulkPublishRequest(IReadOnlyList<Guid> ProductIds, bool IsPublished);

}
