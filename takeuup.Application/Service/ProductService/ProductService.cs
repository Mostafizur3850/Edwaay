using ECommerce.Application.DTOs;
using System.Security.Claims;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Application.Generic;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;


namespace ECommerce.Application.Service
{
    public class ProductService : IProductService
    {
        private readonly IBaseRepository<Product> _productRepository;
        private readonly IBaseRepository<CategoryMetaKeyword> _catmetaKeywordRepository;
        private readonly IBaseRepository<Category> _categoryRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDocumentsInfoService _documentsInfoService;
        private readonly ICMetaKeywordService _cMetaKeywordService;
        private readonly ISkuGenerator _skuGenerator;
        private readonly IBaseRepository<ProductVariant> _productVarianRepository;
        private readonly IPMetaKeywordService _pMetaKeywordService;
        private readonly IProductTagService _productTagService;
        private readonly IProductImageService _productImageService;
        private readonly IBaseRepository<Brand> _brandRepository;
        private readonly IBaseRepository<ProductImage> _productImgbaseRepository;
        private readonly IBaseRepository<ProductMetaKeyword> _productMetaRepository;
        private readonly IBaseRepository<ProductTag> _producTagRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBaseRepository<ProductPriceRequest> _priceRequestRepository;
    
        public ProductService(IBaseRepository<Product> productRepository, IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IDocumentsInfoService documentsInfoService, IBaseRepository<CategoryMetaKeyword> catmetaKeywordRepository, ICMetaKeywordService cMetaKeywordService, ISkuGenerator skuGenerator, IBaseRepository<ProductVariant> productVarianRepository, IPMetaKeywordService pMetaKeywordService, IProductTagService productTagService, IProductImageService productImageService, IBaseRepository<Brand> brandRepository, IBaseRepository<Category> categoryRepository, IBaseRepository<ProductImage> productImgbaseRepository, IBaseRepository<ProductMetaKeyword> productMetaRepository, IBaseRepository<ProductTag> producTagRepository, IHttpContextAccessor httpContextAccessor, IBaseRepository<ProductPriceRequest> priceRequestRepository)
        {
            _productRepository = productRepository;        
            _unitOfWork = unitOfWork;  
            _fileStorageService = fileStorageService;
            _documentsInfoService = documentsInfoService;
            _catmetaKeywordRepository = catmetaKeywordRepository;
            _cMetaKeywordService = cMetaKeywordService;
            _skuGenerator = skuGenerator;
            _productVarianRepository = productVarianRepository;
            _pMetaKeywordService = pMetaKeywordService;
            _productTagService = productTagService;
            _productImageService = productImageService;
            _brandRepository = brandRepository;
            _categoryRepository = categoryRepository;
            _productImgbaseRepository = productImgbaseRepository;
            _productMetaRepository = productMetaRepository;
            _producTagRepository = producTagRepository;
            _httpContextAccessor = httpContextAccessor;
            _priceRequestRepository = priceRequestRepository;
        }




        public async Task<Guid> CreateAsync(  CreateProductDto dto, CancellationToken ct)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Slug = dto.Slug,
                ShortDescription = dto.ShortDescription,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId,
                TaxId = dto.TaxId,
                MetaTitle = dto.Name,
                MetaDescription = dto.MetaDescription,
                VideoLink = dto.VideoLink,
                IsPublished = true,
                PartNumber = dto.PartNumber,
                PriceStatus = dto.PriceStatus ?? "Visible"
            };
            var sku = await GenerateUniqueSkuAsync(product, ct);

            product.Variants.Add(new ProductVariant
            {
                Id = Guid.NewGuid(),
                Sku = sku,
                Price = dto.Price,
                OldPrice = dto.PreviousPrice,
                Stock = dto.Stock,
                IsActive = true
            });

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();


            // ---------- META KEYWORDS ----------
            if (dto.MetaKeywords != null && dto.MetaKeywords.Any())
            {
                foreach (var keyword in dto.MetaKeywords.Distinct())
                {
                    _pMetaKeywordService.Add(new ProductMetaKeyword
                    {
                         ProductId = product.Id,
                        Keyword = keyword.Trim(),
                    });
                }

                await _pMetaKeywordService.SaveAsync(ct);
            }


            if (dto.ProductTags != null && dto.ProductTags.Any())
            {
                foreach (var ProductTags in dto.ProductTags.Distinct())
                {
                    _productTagService.Add(new ProductTag
                    {
                        ProductId = product.Id,
                        Name = ProductTags.Trim(),
                    });
                   
                }
                await _productTagService.SaveAsync(ct);
            }





            // ---------- ICON UPLOAD ----------
            if (dto.FeatureImage != null)
            {
                var uploadedDocs = await _fileStorageService.UploadImageAsync(dto.FeatureImage, "FeatureImage", product.Id, "FeatureImage_", ct);
                var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;

                foreach (var doc in uploadedDocs)
                {
                    _productImageService.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = doc.DocPath,
                        SortOrder = 1,
                        IsPrimary = true,                       
                    });
                }

                await _productImageService.SaveAsync(ct);
            }

            if (dto.GalleryImages != null)
            {
                var uploadedDocs = await _fileStorageService.UploadImageAsync(dto.GalleryImages, "GalleryImages", product.Id, "GalleryImages_", ct);
                var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;
                int sortOrder = 1;
                foreach (var doc in uploadedDocs)
                {
                    _productImageService.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = doc.DocPath,
                        SortOrder = sortOrder,
                        IsPrimary = false,
                    });
                    sortOrder++;
                }

                await _productImageService.SaveAsync(ct);
            }



            return product.Id;
        }


        // ✅ UPDATE
            public async Task UpdateAsync(UpdateProductDto dto, CancellationToken ct)
            {
                var product = await _productRepository.GetAsync(
                    p => p.Id == dto.Id,
                    q => q.Include(p => p.Variants)
                ) ?? throw new Exception("Product not found");

                product.Name = dto.Name;
                product.Slug = dto.Slug;
                product.ShortDescription = dto.ShortDescription;
                product.Description = dto.Description;
                product.CategoryId = dto.CategoryId;
                product.BrandId = dto.BrandId;
                product.TaxId = dto.TaxId;
                product.MetaTitle = dto.MetaTitle;
                product.MetaDescription = dto.MetaDescription;
                product.VideoLink = dto.VideoLink;
                product.IsPublished = true;
                product.PartNumber = dto.PartNumber;
                product.PriceStatus = dto.PriceStatus ?? "Visible";

                var variant = product.Variants.First(); 
                variant.Price = dto.Price;
                variant.OldPrice = dto.PreviousPrice;
                variant.SetStock(dto.Stock);
                variant.Sku = dto.Sku;

                _productRepository.Update(product);
                await _productRepository.SaveChangesAsync();

                // ---------- META KEYWORDS UPDATE ----------
                await _pMetaKeywordService.DeleteByProductIdAsync(product.Id);

                if (dto.MetaKeywords != null && dto.MetaKeywords.Any())
                {
                    foreach (var keyword in dto.MetaKeywords
                        .Select(k => k.Trim())
                        .Where(k => !string.IsNullOrWhiteSpace(k))
                        .Distinct())
                    {
                        _pMetaKeywordService.Add(new ProductMetaKeyword
                        {
                            Id = Guid.NewGuid(),
                            ProductId = product.Id,
                            Keyword = keyword
                        });
                    }

                    await _pMetaKeywordService.SaveAsync();
                }


            await _productTagService.DeleteByProductIdAsync(product.Id);


            if (dto.ProductTags != null && dto.ProductTags.Any())
                {
                    foreach (var ProductTags in dto.ProductTags.Distinct())
                    {
                        _productTagService.Add(new ProductTag
                        {
                            ProductId = product.Id,
                            Name = ProductTags.Trim(),
                        });

                    }
                    await _productTagService.SaveAsync(ct);
                }




            
            // ---------- ICON UPLOAD ----------
            if (dto.FeatureImage != null)
            {
                await _fileStorageService.DeletePrevFilesAsync(EnumDocType.Product, "FeatureImage", product.Id, ct);
                var uploadedDocs = await _fileStorageService.UploadImageAsync(dto.FeatureImage, "FeatureImage", product.Id, "FeatureImage_", ct);
                var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;

                foreach (var doc in uploadedDocs)
                {
                    _productImageService.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = doc.DocPath,
                        SortOrder = 1,
                        IsPrimary = true,
                    });
                }

                await _productImageService.SaveAsync(ct);
            }

            if (dto.RemovedGalleryImages != null && dto.RemovedGalleryImages.Any())
            {
                foreach (var imgPath in dto.RemovedGalleryImages)
                {
                    await _fileStorageService.DeleteSingleGalleryImageAsync(
                        product.Id,
                        imgPath,
                        ct
                    );
                }
            }

            if (dto.GalleryImages != null)
            {
              
                var uploadedDocs = await _fileStorageService.UploadImageAsync(dto.GalleryImages, "GalleryImages", product.Id, "GalleryImages_", ct);
                var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;
                int sortOrder = 1;
                foreach (var doc in uploadedDocs)
                {
                    _productImageService.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = doc.DocPath,
                        SortOrder = sortOrder,
                        IsPrimary = false,
                    });
                    sortOrder++;
                }

                await _productImageService.SaveAsync(ct);
            }
            

        }



        // ✅ DELETE
        public async Task DeleteAsync(Guid id, CancellationToken ct)
        {
            var product = await _productRepository.GetByIdAsync(id)
                ?? throw new Exception("Product not found");
            await _fileStorageService.DeletePrevFilesAsync(EnumDocType.Product, "FeatureImage", product.Id, ct);

            await _productTagService.DeleteByProductIdAsync(product.Id);
            await _pMetaKeywordService.DeleteByProductIdAsync(product.Id);
            _productRepository.Delete(product);
            await _productRepository.SaveChangesAsync();
        }

        // ✅ GET BY ID
        //      public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
        //      {
        //          var product = await _productRepository.GetByIdAsync(id);
        //          if (product == null) return null;

        //          var variant = product.Variants.FirstOrDefault();
        //          if (variant == null) return null;

        //          var images = product.Images
        //              .Select(i => new ProductImageDto(
        //                  i.Id,
        //                  i.Url,
        //                  i.SortOrder,
        //                  i.IsPrimary
        //              ))
        //              .ToList();

        //          var galleryImages = product.Images?
        //  .Where(i => !i.IsPrimary)
        //  .Select(i => i.Url)
        //  .ToList()
        //  ?? new List<string>();

        //          // ✅ MetaKeywords → DTO
        //          var metaKeywords = product.MetaKeywords?
        //              .Select(mk => new ProductMetaKeywordDto
        //              {
        //                  Id = mk.Id,
        //                  Keyword = mk.Keyword
        //              })
        //              .ToList()
        //              ?? new List<ProductMetaKeywordDto>();

        //          // ✅ Tags → DTO
        //          var productTags = product.Tags?
        //              .Select(pt => new ProductTagDto
        //              {
        //                  Id = pt.Id,
        //                  TagName = pt.Name
        //              })
        //              .ToList()
        //              ?? new List<ProductTagDto>();
        //          var featureImageUrl = product.Images?
        //  .FirstOrDefault(i => i.IsPrimary)?.Url;

        //          return new ProductResponseDto(
        //    product.Id,
        //    product.Name,
        //    product.Slug,
        //    product.ShortDescription,
        //    product.Description,
        //    product.MetaDescription,    
        //    product.VideoLink,         
        //    product.CategoryId,
        //    product.BrandId,
        //    variant.Price,
        //    variant.OldPrice,
        //    variant.Stock,
        //    product.IsPublished,
        //    featureImageUrl,
        //    galleryImages,             
        //    images,                     
        //    metaKeywords,
        //    productTags,
        //    product.TaxId                
        //);
        //      }



        public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            var variant = product.Variants.FirstOrDefault();
            if (variant == null) return null;

            // Images
            var images = product.Images
                .Select(i => new ProductImageDto(
                    i.Id,
                    i.Url,
                    i.SortOrder,
                    i.IsPrimary
                ))
                .ToList();

            var galleryImages = product.Images?
                .Where(i => !i.IsPrimary)
                .Select(i => i.Url)
                .ToList()
                ?? new List<string>();

            var featureImageUrl = product.Images?
                .FirstOrDefault(i => i.IsPrimary)?.Url;

            // Meta keywords
            var metaKeywords = product.MetaKeywords?
                .Select(mk => new ProductMetaKeywordDto
                {
                    Id = mk.Id,
                    Keyword = mk.Keyword
                })
                .ToList()
                ?? new List<ProductMetaKeywordDto>();

            // Tags
            var productTags = product.Tags?
                .Select(pt => new ProductTagDto
                {
                    Id = pt.Id,
                    TagName = pt.Name
                })
                .ToList()
                ?? new List<ProductTagDto>();

            // ✅ Category DTO
            CategoryDto? categoryDto = null;
            if (product.Category != null)
            {
                categoryDto = new CategoryDto
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name,
                    Slug = product.Category.Slug
                };
            }

            // ✅ Brand DTO
            BrandDto? brandDto = null;
            if (product.Brand != null)
            {
                brandDto = new BrandDto
                {
                    Id = product.Brand.Id,
                    Name = product.Brand.Name
                };
            }

            var dto = new ProductResponseDto(
                product.Id,
                product.Name,
                product.Slug,
                product.PartNumber,
                variant.Sku,
                product.ShortDescription,
                product.Description,
                product.MetaDescription,
                product.VideoLink,
                product.CategoryId,
                product.BrandId,
                variant.Price,
                variant.OldPrice,
                variant.Stock,
                product.IsPublished,
                variant.Id,
                featureImageUrl,
                galleryImages,
                images,
                metaKeywords,
                productTags,
                product.TaxId,

                // ✅ REQUIRED FIX
                categoryDto,
                brandDto,
                product.PriceStatus ?? "Visible"
            );

            await AdjustPriceForDtosAsync(new List<ProductResponseDto> { dto });
            return dto;
        }




        // ✅ GET ALL


        public async Task<List<ProductResponseDto>> GetAllAsync()
        {
            var dtos = _productRepository.GetAllProductForIndex(  _categoryRepository,   _brandRepository,    _productImgbaseRepository,  _productMetaRepository,  _producTagRepository,   _productVarianRepository
            );
            await AdjustPriceForDtosAsync(dtos);
            return dtos;
        }

        public async Task<List<ProductResponseDto>> GetCategoryWiseAsync(string slug)
        {
            var dtos = _productRepository.GetAllCategoryWiseForIndex(_categoryRepository, _brandRepository, _productImgbaseRepository, _productMetaRepository, _producTagRepository, _productVarianRepository, slug);
            await AdjustPriceForDtosAsync(dtos);
            return dtos;
        }

        public async Task<List<ProductResponseDto>> getBySlug(string slug)
        {
            var dtos = _productRepository.getBySlug(_categoryRepository, _brandRepository, _productImgbaseRepository, _productMetaRepository, _producTagRepository, _productVarianRepository, slug);
            await AdjustPriceForDtosAsync(dtos);
            return dtos;
        }

        



        private async Task<string> GenerateUniqueSkuAsync(
     Product product,
     CancellationToken ct)
        {
            const int maxAttempts = 10;

            for (int i = 0; i < maxAttempts; i++)
            {
                ct.ThrowIfCancellationRequested();

                var sku = _skuGenerator.Generate(product);

                var exists = await _skuGenerator.ExistsSkuAsync(sku, ct);
                if (!exists)
                    return sku;
            }

            throw new InvalidOperationException(
                "Failed to generate a unique SKU after multiple attempts.");
        }





        public async Task ToggleStatusAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return;

            product.IsPublished = !product.IsPublished;
            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();
        }

        public async Task<PagedResult<ProductResponseDto>> GetCategoryWiseFilteredAsync(
    string slug,
    CategoryProductFilterDto filter)
        {
            var result = _productRepository.GetAllCategoryWiseFilteredForIndex(
                _categoryRepository,
                _brandRepository,
                _productImgbaseRepository,
                _productMetaRepository,
                _producTagRepository,
                _productVarianRepository,
                slug,
                filter
            );
            await AdjustPriceForDtosAsync(result.Items);
            return result;
        }

        public async Task<PagedResult<ProductResponseDto>> GetAllFilteredAsync(
    CategoryProductFilterDto filter
)
        {
            var result = _productRepository.GetAllFilteredForIndex(
                _categoryRepository,
                _brandRepository,
                _productImgbaseRepository,
                _productMetaRepository,
                _producTagRepository,
                _productVarianRepository,
                filter
            );
            await AdjustPriceForDtosAsync(result.Items);
            return result;
        }



        //public async Task<List<SearchSuggestDto>> SuggestAsync(string keyword)
        //{
        //    if (string.IsNullOrWhiteSpace(keyword))
        //        return new List<SearchSuggestDto>();

        //    keyword = keyword.Trim();

        //    var query =
        //        from p in _productRepository.All.AsNoTracking()
        //        join pv in _productVarianRepository.All.AsNoTracking()
        //            on p.Id equals pv.ProductId
        //        join img in _productImgbaseRepository.All.AsNoTracking()
        //            on p.Id equals img.ProductId into imgJoin
        //        from image in imgJoin
        //            .Where(i => i.IsPrimary)
        //            .DefaultIfEmpty()
        //        where p.IsPublished
        //              && pv.IsActive
        //              && EF.Functions.Like(p.Name, $"%{keyword}%")
        //        select new SearchSuggestDto
        //        {
        //            Id = p.Id,
        //            Name = p.Name,
        //            Slug = p.Slug,
        //            FeatureImageUrl = image != null ? image.Url : null,
        //            Price = pv.Price,
        //            CategorySlug =
        //        };

        //    return await query
        //        .OrderByDescending(x => x.Name.StartsWith(keyword))
        //        .Take(6)
        //        .ToListAsync();
        //}

        public async Task<List<SearchSuggestDto>> SuggestAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return new List<SearchSuggestDto>();

            keyword = keyword.Trim();

            var query =
                from p in _productRepository.All.AsNoTracking()
                join pv in _productVarianRepository.All.AsNoTracking()
                    on p.Id equals pv.ProductId
                join img in _productImgbaseRepository.All.AsNoTracking()
                    on p.Id equals img.ProductId into imgJoin
                from image in imgJoin
                    .Where(i => i.IsPrimary)
                    .DefaultIfEmpty()
                join c in _categoryRepository.All.AsNoTracking()  
                    on p.CategoryId equals c.Id 
                where p.IsPublished
                      && pv.IsActive
                      && EF.Functions.Like(p.Name, $"%{keyword}%")
                select new SearchSuggestDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    FeatureImageUrl = image != null ? image.Url : null,
                    Price = pv.Price,
                    CategorySlug = c.Slug  
                };

            return await query
                .OrderByDescending(x => x.Name.StartsWith(keyword))
                .Take(6)
                .ToListAsync();
        }




        public async Task<List<string>> GetUniqueTagsAsync()
        {
            return await _producTagRepository.All
                .AsNoTracking()
                .Select(t => t.Name.Trim())
                .Distinct()
                .Take(15) 
                .ToListAsync();
        }

        private async Task AdjustPriceForDtosAsync(List<ProductResponseDto> dtos)
        {
            if (dtos == null || !dtos.Any()) return;

            var httpContext = _httpContextAccessor.HttpContext;
            var userIdStr = httpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                            ?? httpContext?.User?.FindFirst("id")?.Value;
            
            Guid? userId = null;
            if (!string.IsNullOrEmpty(userIdStr) && Guid.TryParse(userIdStr, out var parsedGuid))
            {
                userId = parsedGuid;
            }

            foreach (var dto in dtos)
            {
                if (dto.PriceStatus == "Hidden")
                {
                    decimal? quotedPrice = null;
                    if (userId.HasValue)
                    {
                        var request = await _priceRequestRepository.GetAsync(r => 
                            r.ProductId == dto.Id && 
                            r.UserId == userId.Value && 
                            r.Status == "Quoted"
                        );
                        quotedPrice = request?.QuotedPrice;
                    }

                    if (quotedPrice.HasValue)
                    {
                        dto.Price = quotedPrice.Value;
                        dto.PriceStatus = "Quoted";
                    }
                    else
                    {
                        dto.Price = 0;
                    }
                }
            }
        }
    }
}

