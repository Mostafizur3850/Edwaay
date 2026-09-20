using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class ProductMetaKeywordDto
    {
        public Guid Id { get; set; }
        public string Keyword { get; set; }
    }

    public class ProductTagDto
    {
        public Guid Id { get; set; }
        public string TagName { get; set; }
    }
}


public class ProductResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string PartNumber { get; set; }
    public string ShortDescription { get; set; }
    public string Description { get; set; }
    public string? MetaDescription { get; set; }
    public string? VideoLink { get; set; }

    public Guid CategoryId { get; set; }
    public Guid? BrandId { get; set; }

    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int Stock { get; set; }
    public bool IsPublished { get; set; }
    public Guid VariantId { get; set; }

    public string? FeatureImageUrl { get; set; }
    public Guid? TaxId { get; set; }
    // ✅ ADD THESE
    public CategoryDto? Category { get; set; }
    public BrandDto? Brand { get; set; }

    public List<string> GalleryImages { get; set; }
    public List<ProductImageDto> Images { get; set; }
    public List<ProductMetaKeywordDto> MetaKeywords { get; set; }
    public List<ProductTagDto> Tags { get; set; }
    public string? Sku { get; set; }
    public string PriceStatus { get; set; } = "Visible";

    public ProductResponseDto(
        Guid id,
        string name,
        string slug,
        string partNumber,
        string? sku,
        string shortDescription,
        string description,
        string? metaDescription,
        string? videoLink,
        Guid categoryId,
        Guid? brandId,
        decimal price,
        decimal? oldPrice,
        int stock,
        bool isPublished,
        Guid variantId,
        string? featureImageUrl,
        List<string> galleryImages,
        List<ProductImageDto> images,
        List<ProductMetaKeywordDto> metaKeywords,
        List<ProductTagDto> tags,
        Guid? taxId,
         CategoryDto? category,
        BrandDto? brand,
        string priceStatus = "Visible"
    )
    {
        Id = id;
        Name = name;
        Slug = slug;
        PartNumber = partNumber;
        Sku = sku;
        ShortDescription = shortDescription;
        Description = description;
        MetaDescription = metaDescription;
        VideoLink = videoLink;
        CategoryId = categoryId;
        BrandId = brandId;
        Price = price;
        OldPrice = oldPrice;
        Stock = stock;
        IsPublished = isPublished;
        VariantId = variantId;
        FeatureImageUrl = featureImageUrl;
        GalleryImages = galleryImages;
        Images = images;
        MetaKeywords = metaKeywords;
        Tags = tags;
        TaxId = taxId;
        Category = category;
        Brand = brand;
        PriceStatus = priceStatus;

    }
}

