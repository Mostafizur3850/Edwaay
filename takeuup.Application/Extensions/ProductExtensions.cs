using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Application.Generic;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

public static class ProductExtensions
{

    public static PagedResult<ProductResponseDto> GetAllCategoryWiseFilteredForIndex(
     this IBaseRepository<Product> productRepository,
     IBaseRepository<Category> categoryRepository,
     IBaseRepository<Brand> brandRepository,
     IBaseRepository<ProductImage> productImgRepository,
     IBaseRepository<ProductMetaKeyword> productMetaRepository,
     IBaseRepository<ProductTag> producTagRepository,
     IBaseRepository<ProductVariant> productVarianRepository,
     string slug,
     CategoryProductFilterDto filter
 )
    {
        int page = filter.Page <= 0 ? 1 : filter.Page;
        int pageSize = filter.PageSize <= 0 ? 20 : Math.Min(filter.PageSize, 50);

        // 🔥 STEP 1: PURE IQueryable (NO ToList)
        var query =
            from p in productRepository.All.AsNoTracking()
            join pv in productVarianRepository.All.AsNoTracking()
                on p.Id equals pv.ProductId
            join c in categoryRepository.All.AsNoTracking()
                on p.CategoryId equals c.Id
            where p.IsPublished && pv.IsActive && c.Slug == slug
            select new
            {
                ProductId = p.Id,
                VariantId = pv.Id,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,

                p.Name,
                p.Slug,
                p.PartNumber,
                p.PriceStatus,

                p.ShortDescription,
                p.Description,
                p.MetaDescription,
                p.VideoLink,
                p.CreatedAt,
                p.TaxId,

                pv.Sku,
                pv.Price,
                pv.OldPrice,
                pv.Stock,

                CategoryName = c.Name,
                CategorySlug = c.Slug,
           
            };

        // 🔹 Price filter
        if (filter.MinPrice.HasValue)
            query = query.Where(x => x.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(x => x.Price <= filter.MaxPrice.Value);

        // 🔹 Brand filter
        if (filter.Brands != null && filter.Brands.Any())
        {
            var brandIds = brandRepository.All
                .Where(b => filter.Brands.Contains(b.Name))
                .Select(b => b.Id);

            query = query.Where(x => x.BrandId.HasValue &&
                                     brandIds.Contains(x.BrandId.Value));
        }

        // 🔹 Sorting
        query = filter.SortBy switch
        {
            "price-low-high" => query.OrderBy(x => x.Price),
            "price-high-low" => query.OrderByDescending(x => x.Price),
            "latest" => query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        // 🔥 STEP 2: TOTAL COUNT (before pagination)
        int totalCount = query.Count();

        // 🔥 STEP 3: Pagination at DB level
        var pagedData = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var productIds = pagedData.Select(x => x.ProductId).ToList();

        // 🔥 STEP 4: Load only related data for current page
        var images = productImgRepository.All
            .AsNoTracking()
            .Where(i => productIds.Contains(i.ProductId))
            .ToList();

        var metaKeywords = productMetaRepository.All
            .AsNoTracking()
            .Where(m => productIds.Contains(m.ProductId))
            .ToList();

        var tags = producTagRepository.All
            .AsNoTracking()
            .Where(t => productIds.Contains(t.ProductId))
            .ToList();

        var brandIdsForPage = pagedData
            .Where(x => x.BrandId.HasValue)
            .Select(x => x.BrandId.Value)
            .Distinct()
            .ToList();

        var brands = brandRepository.All
            .AsNoTracking()
            .Where(b => brandIdsForPage.Contains(b.Id))
            .ToList();

        // 🔥 STEP 5: Map DTO
        var items = pagedData.Select(x =>
        {
            var featureImage = images
                .FirstOrDefault(img => img.ProductId == x.ProductId && img.IsPrimary);

            var galleryImages = images
                .Where(img => img.ProductId == x.ProductId && !img.IsPrimary)
                .ToList();

            var brand = brands.FirstOrDefault(b => b.Id == x.BrandId);

            return new ProductResponseDto(
                x.ProductId,
                x.Name,
                x.Slug,
                x.PartNumber,
                x.Sku,
                x.ShortDescription,
                x.Description,
                x.MetaDescription,
                x.VideoLink,
                x.CategoryId,
                x.BrandId,
                x.Price,
                x.OldPrice,
                x.Stock,
                true,
                x.VariantId,
                featureImage?.Url,
                galleryImages.Select(g => g.Url).ToList(),
                galleryImages
                    .Concat(featureImage != null ? new[] { featureImage } : Enumerable.Empty<ProductImage>())
                    .Select(img => new ProductImageDto(
                        img.Id,
                        img.Url,
                        img.SortOrder,
                        img.IsPrimary
                    )).ToList(),
                metaKeywords
                    .Where(mk => mk.ProductId == x.ProductId)
                    .Select(mk => new ProductMetaKeywordDto
                    {
                        Id = mk.Id,
                        Keyword = mk.Keyword
                    }).ToList(),
                tags
                    .Where(t => t.ProductId == x.ProductId)
                    .Select(t => new ProductTagDto
                    {
                        Id = t.Id,
                        TagName = t.Name
                    }).ToList(),
                x.TaxId,
                new CategoryDto
                {
                    Id = x.CategoryId,
                    Name = x.CategoryName,
                    Slug = x.CategorySlug
                },
                brand != null
                    ? new BrandDto
                    {
                        Id = brand.Id,
                        Name = brand.Name
                    }
                    : null,
                x.PriceStatus ?? "Visible"
            );
        }).ToList();

        return new PagedResult<ProductResponseDto>
        {
            Items = items,
            TotalCount = totalCount
        };
    }


    public static List<ProductResponseDto> GetAllProductForIndex(
    this IBaseRepository<Product> productRepository,
    IBaseRepository<Category> categoryRepository,
    IBaseRepository<Brand> brandRepository,
    IBaseRepository<ProductImage> productImgRepository,
    IBaseRepository<ProductMetaKeyword> productMetaRepository,
    IBaseRepository<ProductTag> producTagRepository,
    IBaseRepository<ProductVariant> productVarianRepository
)
    {
        var baseProducts = (
            from p in productRepository.All
            join pv in productVarianRepository.All on p.Id equals pv.ProductId
            select new { Product = p, Variant = pv }
        ).ToList();

        var allImages = productImgRepository.All.ToList();
        var allMetaKeywords = productMetaRepository.All.ToList();
        var allTags = producTagRepository.All.ToList();
        var allCategories = categoryRepository.All.ToList();
        var allBrands = brandRepository.All.ToList();

        var products = baseProducts.Select(x =>
        {
            var featureImage = allImages
                .FirstOrDefault(img => img.ProductId == x.Product.Id && img.IsPrimary);

            var galleryImages = allImages
                .Where(img => img.ProductId == x.Product.Id && !img.IsPrimary)
                .ToList();

            var category = allCategories.FirstOrDefault(c => c.Id == x.Product.CategoryId);
            var brand = allBrands.FirstOrDefault(b => b.Id == x.Product.BrandId);

            return new ProductResponseDto(
                x.Product.Id,
                x.Product.Name,
                x.Product.Slug,
                x.Product.PartNumber,
                x.Variant.Sku,
                x.Product.ShortDescription,
                x.Product.Description,
                x.Product.MetaDescription,
                x.Product.VideoLink,
                x.Product.CategoryId,
                x.Product.BrandId,
                x.Variant.Price,
                x.Variant.OldPrice,
                x.Variant.Stock,
                x.Product.IsPublished,
                x.Variant.Id,

                featureImage?.Url,

                galleryImages.Select(g => g.Url).ToList(),

                galleryImages
                    .Concat(featureImage != null ? new[] { featureImage } : Enumerable.Empty<ProductImage>())
                    .Select(img => new ProductImageDto(
                        img.Id,
                        img.Url,
                        img.SortOrder,
                        img.IsPrimary
                    ))
                    .ToList(),

                allMetaKeywords
                    .Where(mk => mk.ProductId == x.Product.Id)
                    .Select(mk => new ProductMetaKeywordDto
                    {
                        Id = mk.Id,
                        Keyword = mk.Keyword
                    })
                    .ToList(),

                allTags
                    .Where(t => t.ProductId == x.Product.Id)
                    .Select(t => new ProductTagDto
                    {
                        Id = t.Id,
                        TagName = t.Name
                    })
                    .ToList(),

                x.Product.TaxId,

                // ✅ REQUIRED parameters
                category != null ? new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Slug= category.Slug
                } : null,

                brand != null ? new BrandDto
                {
                    Id = brand.Id,
                    Name = brand.Name
                } : null,
                x.Product.PriceStatus ?? "Visible"
            );
        }).ToList();

        return products;
    }





    public static List<ProductResponseDto> GetAllCategoryWiseForIndex(
     this IBaseRepository<Product> productRepository,
     IBaseRepository<Category> categoryRepository,
     IBaseRepository<Brand> brandRepository,
     IBaseRepository<ProductImage> productImgRepository,
     IBaseRepository<ProductMetaKeyword> productMetaRepository,
     IBaseRepository<ProductTag> producTagRepository,
     IBaseRepository<ProductVariant> productVarianRepository,
     string slug
 )
    {
        // STEP 1: Base product + variant (materialize)
        var baseProducts = (
            from p in productRepository.All
            join pv in productVarianRepository.All on p.Id equals pv.ProductId
            join c in categoryRepository.All on p.CategoryId equals c.Id
            where c.Slug == slug
            select new
            {
                Product = p,
                Variant = pv,
                Category = c
            }
        ).ToList();

        // STEP 2: Lookup data
        var allImages = productImgRepository.All.ToList();
        var allMetaKeywords = productMetaRepository.All.ToList();
        var allTags = producTagRepository.All.ToList();
        var allBrands = brandRepository.All.ToList();

        // STEP 3: Map DTO
        var products = baseProducts.Select(x =>
        {
            var featureImage = allImages
                .FirstOrDefault(img => img.ProductId == x.Product.Id && img.IsPrimary);

            var galleryImages = allImages
                .Where(img => img.ProductId == x.Product.Id && !img.IsPrimary)
                .ToList();

            var brand = allBrands.FirstOrDefault(b => b.Id == x.Product.BrandId);

            return new ProductResponseDto(
                x.Product.Id,
                x.Product.Name,
                x.Product.Slug,
                x.Product.PartNumber,
                x.Variant.Sku,           
                x.Product.ShortDescription,
                x.Product.Description,
                x.Product.MetaDescription,
                x.Product.VideoLink,
                x.Product.CategoryId,
                x.Product.BrandId,
                x.Variant.Price,
                x.Variant.OldPrice,
                x.Variant.Stock,
                x.Product.IsPublished,
                x.Variant.Id,
                // Feature image
                featureImage?.Url,

                // Gallery images (string list)
                galleryImages.Select(g => g.Url).ToList(),

                // Image DTOs
                galleryImages
                    .Concat(featureImage != null ? new[] { featureImage } : Enumerable.Empty<ProductImage>())
                    .Select(img => new ProductImageDto(
                        img.Id,
                        img.Url,
                        img.SortOrder,
                        img.IsPrimary
                    ))
                    .ToList(),

                // Meta keywords
                allMetaKeywords
                    .Where(mk => mk.ProductId == x.Product.Id)
                    .Select(mk => new ProductMetaKeywordDto
                    {
                        Id = mk.Id,
                        Keyword = mk.Keyword
                    })
                    .ToList(),

                // Tags
                allTags
                    .Where(t => t.ProductId == x.Product.Id)
                    .Select(t => new ProductTagDto
                    {
                        Id = t.Id,
                        TagName = t.Name
                    })
                    .ToList(),

                x.Product.TaxId,

                // ✅ Category DTO
                new CategoryDto
                {
                    Id = x.Category.Id,
                    Name = x.Category.Name,
                    Slug = x.Category.Slug
                },

                // ✅ Brand DTO (nullable)
                brand != null
                    ? new BrandDto
                    {
                        Id = brand.Id,
                        Name = brand.Name
                    }
                    : null,
                x.Product.PriceStatus ?? "Visible"
            );
        }).ToList();

        return products;
    }





    public static List<ProductResponseDto> getBySlug(
     this IBaseRepository<Product> productRepository,
     IBaseRepository<Category> categoryRepository,
     IBaseRepository<Brand> brandRepository,
     IBaseRepository<ProductImage> productImgRepository,
     IBaseRepository<ProductMetaKeyword> productMetaRepository,
     IBaseRepository<ProductTag> producTagRepository,
     IBaseRepository<ProductVariant> productVarianRepository,
     string slug
 )
    {
        var baseProducts = (
            from p in productRepository.All
            join pv in productVarianRepository.All on p.Id equals pv.ProductId
            where p.Slug == slug
            select new { Product = p, Variant = pv }
        ).ToList();

        var allImages = productImgRepository.All.ToList();
        var allMetaKeywords = productMetaRepository.All.ToList();
        var allTags = producTagRepository.All.ToList();
        var allCategories = categoryRepository.All.ToList();
        var allBrands = brandRepository.All.ToList();

        var products = baseProducts.Select(x =>
        {
            var featureImage = allImages
                .FirstOrDefault(img => img.ProductId == x.Product.Id && img.IsPrimary);

            var galleryImages = allImages
                .Where(img => img.ProductId == x.Product.Id && !img.IsPrimary)
                .ToList();

            var category = allCategories.FirstOrDefault(c => c.Id == x.Product.CategoryId);
            var brand = allBrands.FirstOrDefault(b => b.Id == x.Product.BrandId);

            return new ProductResponseDto(
                x.Product.Id,
                x.Product.Name,
                x.Product.Slug,
                x.Product.PartNumber,
                x.Variant.Sku,            
                x.Product.ShortDescription,
                x.Product.Description,
                x.Product.MetaDescription,
                x.Product.VideoLink,
                x.Product.CategoryId,
                x.Product.BrandId,
                x.Variant.Price,
                x.Variant.OldPrice,
                x.Variant.Stock,
                x.Product.IsPublished, 
                x.Variant.Id,

                // feature image
                featureImage?.Url,

                // gallery image urls
                galleryImages.Select(g => g.Url).ToList(),

                // image DTOs
                galleryImages
                    .Concat(featureImage != null ? new[] { featureImage } : Enumerable.Empty<ProductImage>())
                    .Select(img => new ProductImageDto(
                        img.Id,
                        img.Url,
                        img.SortOrder,
                        img.IsPrimary
                    ))
                    .ToList(),

                // meta keywords ✅ CORRECT POSITION
                allMetaKeywords
                    .Where(mk => mk.ProductId == x.Product.Id)
                    .Select(mk => new ProductMetaKeywordDto
                    {
                        Id = mk.Id,
                        Keyword = mk.Keyword
                    })
                    .ToList(),

                // tags ✅ CORRECT POSITION
                allTags
                    .Where(t => t.ProductId == x.Product.Id)
                    .Select(t => new ProductTagDto
                    {
                        Id = t.Id,
                        TagName = t.Name
                    })
                    .ToList(),

                // tax
                x.Product.TaxId,

                // category DTO
                category != null ? new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Slug = category.Slug
                } : null,

                // brand DTO
                brand != null ? new BrandDto
                {
                    Id = brand.Id,
                    Name = brand.Name
                } : null,
                x.Product.PriceStatus ?? "Visible"
            );
        }).ToList();

        return products;
    }


    public static PagedResult<ProductResponseDto> GetAllFilteredForIndex(
    this IBaseRepository<Product> productRepository,
    IBaseRepository<Category> categoryRepository,
    IBaseRepository<Brand> brandRepository,
    IBaseRepository<ProductImage> productImgRepository,
    IBaseRepository<ProductMetaKeyword> productMetaRepository,
    IBaseRepository<ProductTag> producTagRepository,
    IBaseRepository<ProductVariant> productVarianRepository,
    CategoryProductFilterDto filter
)
    {
        int page = filter.Page <= 0 ? 1 : filter.Page;
        int pageSize = filter.PageSize <= 0 ? 20 : Math.Min(filter.PageSize, 50);

      

        var baseQuery =
            from p in productRepository.All.AsNoTracking()
            join pv in productVarianRepository.All.AsNoTracking()
                on p.Id equals pv.ProductId
            join c in categoryRepository.All.AsNoTracking()
                on p.CategoryId equals c.Id
            join b in brandRepository.All.AsNoTracking()
                on p.BrandId equals b.Id into brandJoin
            from brand in brandJoin.DefaultIfEmpty()
            where pv.IsActive

            //where p.IsPublished && pv.IsActive
            select new
            {
                Product = p,
                Variant = pv,
                Category = c,
                Brand = brand,
                PartNumber = p.PartNumber
            };      


        if (!filter.UserRole) 
        {
            baseQuery = baseQuery.Where(x => x.Product.IsPublished);
        }


        if (filter.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(x => x.Product.CategoryId == filter.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();

            baseQuery = baseQuery.Where(x =>
                EF.Functions.Like(x.Product.Name, $"%{search}%") ||
                EF.Functions.Like(x.Variant.Sku, $"%{search}%") ||
                EF.Functions.Like(x.Category.Name, $"%{search}%") ||
                (x.Brand != null && EF.Functions.Like(x.Brand.Name, $"%{search}%")) ||
                // 🔹 NEW: Search in Tags
                producTagRepository.All.Any(t =>
                    t.ProductId == x.Product.Id &&
                    EF.Functions.Like(t.Name, $"%{search}%")) ||
                // 🔹 NEW: Search in Meta Keywords
                productMetaRepository.All.Any(m =>
                    m.ProductId == x.Product.Id &&
                    EF.Functions.Like(m.Keyword, $"%{search}%"))
            );
        }

        // 🔹 Price filter
        if (filter.MinPrice.HasValue)
            baseQuery = baseQuery.Where(x => x.Variant.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            baseQuery = baseQuery.Where(x => x.Variant.Price <= filter.MaxPrice.Value);

        // 🔹 Brand filter
        if (filter.Brands != null && filter.Brands.Any())
            baseQuery = baseQuery.Where(x =>
                x.Brand != null &&
                filter.Brands.Contains(x.Brand.Name));        


        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            baseQuery = filter.SortBy.ToLower() switch
            {
                "price-low-high" => baseQuery.OrderBy(x => x.Variant.Price),
                "price-high-low" => baseQuery.OrderByDescending(x => x.Variant.Price),
                "latest" => baseQuery.OrderByDescending(x => x.Product.CreatedAt),
                "oldest" => baseQuery.OrderBy(x => x.Product.CreatedAt),
                _ => baseQuery.OrderByDescending(x => x.Product.CreatedAt)
            };
        }
        else if (!string.IsNullOrWhiteSpace(filter.SortDirection))
        {
            var dir = filter.SortDirection.ToLower().Trim();

            if (dir == "asc" || dir == "ascending")
            {
                baseQuery = baseQuery.OrderBy(x => x.Product.CreatedAt);
            }
            else if (dir == "desc" || dir == "descending")
            {
                baseQuery = baseQuery.OrderByDescending(x => x.Product.CreatedAt);
            }
            else
            {
                baseQuery = baseQuery.OrderByDescending(x => x.Product.CreatedAt);
            }
        }
        else
        {
            baseQuery = baseQuery.OrderByDescending(x => x.Product.CreatedAt);
        }



        int totalCount = baseQuery.Count();

        var pagedProducts = baseQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var productIds = pagedProducts.Select(x => x.Product.Id).Distinct().ToList();

        // 🔹 Load Images
        var images = productImgRepository.All
            .Where(i => productIds.Contains(i.ProductId))
            .AsNoTracking()
            .ToList();

        // 🔹 Load Meta Keywords
        var metaKeywords = productMetaRepository.All
            .Where(m => productIds.Contains(m.ProductId))
            .AsNoTracking()
            .ToList();

        // 🔹 Load Tags
        var tags = producTagRepository.All
            .Where(t => productIds.Contains(t.ProductId))
            .AsNoTracking()
            .ToList();

        var items = pagedProducts.Select(x =>
        {
            var productImages = images
                .Where(i => i.ProductId == x.Product.Id)
                .ToList();

            var featureImage = productImages
                .FirstOrDefault(i => i.IsPrimary)?.Url;

            var gallery = productImages
                .Select(i => i.Url
                )
                .ToList();

            var productMeta = metaKeywords
                .Where(m => m.ProductId == x.Product.Id)
                .Select(m => new ProductMetaKeywordDto
                {
                    Id = m.Id,
                    Keyword = m.Keyword
                })
                .ToList();

            var productTags = tags
                .Where(t => t.ProductId == x.Product.Id)
                .Select(t => new ProductTagDto
                {
                    Id = t.Id,
                    TagName = t.Name
                })
                .ToList();

            return new ProductResponseDto(
                x.Product.Id,
                x.Product.Name,
                x.Product.Slug,
                x.Product.PartNumber,
                x.Variant.Sku,
                x.Product.ShortDescription,
                x.Product.Description,
                x.Product.MetaDescription,
                x.Product.VideoLink,
                x.Product.CategoryId,
                x.Product.BrandId,
                x.Variant.Price,
                x.Variant.OldPrice,
                x.Variant.Stock,
                x.Product.IsPublished,
                x.Variant.Id,
                featureImage,                      // ✅ Feature Image
                gallery ?? new List<string>(),     // ✅ Gallery Images
                new List<ProductImageDto>(),       // (optional if needed)
                productMeta,                       // ✅ Meta Keywords
                productTags,                       // ✅ Tags
                x.Product.TaxId,
                new CategoryDto
                {
                    Id = x.Category.Id,
                    Name = x.Category.Name,
                    Slug = x.Category.Slug
                },
                x.Brand != null
                    ? new BrandDto
                    {
                        Id = x.Brand.Id,
                        Name = x.Brand.Name
                    }
                    : null,
                x.Product.PriceStatus ?? "Visible"
            );
        }).ToList();

        return new PagedResult<ProductResponseDto>
        {
            Items = items,
            TotalCount = totalCount
        };
    }





}
