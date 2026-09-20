using ECommerce.Application.DTOs;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service.HomePageService
{
    public class HomePageService : IHomePageService
    {
        private readonly IBaseRepository<HomeTopAd> _topAdRepo;
        private readonly IBaseRepository<HomeHeroBanner> _heroRepo;
        private readonly IBaseRepository<HomePopularCategorySection> _popularRepo;
        private readonly IBaseRepository<HomeThreeColumnSection> _threeRepo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _uow;

        public HomePageService(
            IBaseRepository<HomeTopAd> topAdRepo,
            IBaseRepository<HomeHeroBanner> heroRepo,
            IBaseRepository<HomePopularCategorySection> popularRepo,
            IBaseRepository<HomeThreeColumnSection> threeRepo,
            IFileStorageService fileStorage,
            IUnitOfWork uow)
        {
            _topAdRepo = topAdRepo;
            _heroRepo = heroRepo;
            _popularRepo = popularRepo;
            _threeRepo = threeRepo;
            _fileStorage = fileStorage;
            _uow = uow;
        }

        // ================= GET (Frontend) =================
        public async Task<HomePageDto> GetAsync()
        {
            return new HomePageDto
            {
                TopAd = await _topAdRepo.All
                    .Where(x => x.IsActive)
                    .Select(x => new HomeTopAdDto
                    {
                        Id = x.Id,
                        ImageUrl = x.ImageUrl,
                        Title = x.Title,
                        Subtitle = x.Subtitle,
                        Url = x.Url,
                        IsActive = x.IsActive
                    }).FirstOrDefaultAsync(),
                

                HeroBanners = await _heroRepo.All
                .Where(x => x.IsActive)
                .OrderBy(x => x.SortOrder)
                .Select(x => new HomeHeroBannerDto
                {
                    Id = x.Id,
                    ImageUrl = x.ImageUrl,
                    Title = x.Title,
                    Subtitle = x.Subtitle,
                    Url = x.Url,
                    SortOrder = x.SortOrder
                })
                .ToListAsync(),

                PopularCategories = await _popularRepo.All
                    .Include(x => x.Categories)
                    .Select(x => new HomePopularCategoryDto
                    {
                        SectionTitle = x.SectionTitle,
                        Categories = x.Categories
                            .OrderBy(c => c.SortOrder)
                            .Select(c => new HomeCategoryItemDto
                            {
                                CategoryId = c.CategoryId,
                                SubCategoryId = c.SubCategoryId,
                                ChildCategoryId = c.ChildCategoryId,
                                SortOrder = c.SortOrder
                            }).ToList()
                    }).FirstOrDefaultAsync(),
                            TopAds = await _topAdRepo.All
                .Where(x => x.IsActive)
                .Select(x => new HomeTopAdDto
                {
                    Id = x.Id,
                    ImageUrl = x.ImageUrl,
                    Title = x.Title,
                    Subtitle = x.Subtitle,
                    Url = x.Url,
                    IsActive = x.IsActive
                })
                .ToListAsync(),

                ThreeColumnCategories = await _threeRepo.All
                    .Include(x => x.Categories)
                    .Select(x => new HomeThreeColumnDto
                    {
                        SectionTitle = x.SectionTitle,
                        Categories = x.Categories
                            .OrderBy(c => c.SortOrder)
                            .Select(c => new HomeCategoryItemDto
                            {
                                CategoryId = c.CategoryId,
                                SubCategoryId = c.SubCategoryId,
                                ChildCategoryId = c.ChildCategoryId,
                                SortOrder = c.SortOrder
                            }).ToList()
                    }).FirstOrDefaultAsync()
            };
        }

        // ================= HERO BANNER =================
        public async Task UpdateHeroBannerAsync(HomeHeroBannerUpdateDto dto)
        {
            HomeHeroBanner banner;

            if (dto.Id.HasValue)
                banner = await _heroRepo.GetByIdAsync(dto.Id.Value);
            else
            {
                banner = new HomeHeroBanner
                {
                    Title = "",
                    Url = "#",
                    SortOrder = 0,
                    IsActive = true
                };
                await _heroRepo.AddAsync(banner);
            }

            if (dto.Title != null) banner.Title = dto.Title;
            if (dto.Subtitle != null) banner.Subtitle = dto.Subtitle;
            if (dto.Url != null) banner.Url = dto.Url;
            if (dto.SortOrder.HasValue) banner.SortOrder = dto.SortOrder.Value;
            if (dto.IsActive.HasValue) banner.IsActive = dto.IsActive.Value;

            if (dto.ImageFile != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage, "Hero", banner.Id, CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.ImageFile },
                    "Hero", banner.Id, "hero_", CancellationToken.None);

                banner.ImageUrl = upload.First().DocPath;
            }

            banner.SetUpdated();
            await _uow.CommitAsync();
        }

        // ================= POPULAR CATEGORY =================
        public async Task UpdatePopularCategoryAsync(HomePopularCategoryDto dto)
        {
            var section = await _popularRepo.All
                .Include(x => x.Categories)
                .FirstOrDefaultAsync();

            if (section == null)
            {
                section = new HomePopularCategorySection { SectionTitle = dto.SectionTitle };
                await _popularRepo.AddAsync(section);
            }

            section.SectionTitle = dto.SectionTitle;
            section.Categories.Clear();

            foreach (var c in dto.Categories)
            {
                section.Categories.Add(new HomePopularCategoryItem
                {
                    CategoryId = c.CategoryId,
                    SubCategoryId = c.SubCategoryId,
                    ChildCategoryId = c.ChildCategoryId,
                    SortOrder = c.SortOrder
                });
            }

            await _uow.CommitAsync();
        }

        // ================= THREE COLUMN =================
        public async Task UpdateThreeColumnCategoryAsync(HomeThreeColumnDto dto)
        {
            var section = await _threeRepo.All
                .Include(x => x.Categories)
                .FirstOrDefaultAsync();

            if (section == null)
            {
                section = new HomeThreeColumnSection { SectionTitle = dto.SectionTitle };
                await _threeRepo.AddAsync(section);
            }

            section.SectionTitle = dto.SectionTitle;
            section.Categories.Clear();

            foreach (var c in dto.Categories)
            {
                section.Categories.Add(new HomeThreeColumnItem
                {
                    CategoryId = c.CategoryId,
                    SubCategoryId = c.SubCategoryId,
                    ChildCategoryId = c.ChildCategoryId,
                    SortOrder = c.SortOrder
                });
            }

            await _uow.CommitAsync();
        }



        // ================= TOP AD =================
        public async Task UpdateTopAdAsync(HomeTopAdUpdateDto dto)
        {
            var ad = await _topAdRepo.All.FirstOrDefaultAsync();

            if (ad == null)
            {
                ad = new HomeTopAd
                {
                    Title = "",
                    Url = "#",
                    IsActive = true
                };
                await _topAdRepo.AddAsync(ad);
            }

            if (dto.Title != null) ad.Title = dto.Title;
            if (dto.Subtitle != null) ad.Subtitle = dto.Subtitle;
            if (dto.Url != null) ad.Url = dto.Url;
            if (dto.IsActive.HasValue) ad.IsActive = dto.IsActive.Value;

            if (dto.ImageFile != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage, "TopAd", ad.Id, CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.ImageFile },
                    "TopAd", ad.Id, "top_", CancellationToken.None);

                ad.ImageUrl = upload.First().DocPath;
            }

            ad.SetUpdated();
            await _uow.CommitAsync();
        }

    }

}
