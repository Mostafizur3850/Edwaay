using ECommerce.Application.DTOs;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Service.HomeSliderService
{
    public class HomeSliderService : IHomeSliderService
    {
        private readonly IBaseRepository<HomeSlider> _repo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _uow;

        public HomeSliderService(
            IBaseRepository<HomeSlider> repo,
            IFileStorageService fileStorage,
            IUnitOfWork uow)
        {
            _repo = repo;
            _fileStorage = fileStorage;
            _uow = uow;
        }

        // ================= GET (Frontend) =================
        public async Task<List<HomeSliderDto>> GetAsync()
        {
            return await _repo.All
                .Where(x => x.IsActive)
                .OrderBy(x => x.HomePosition)
                .ThenBy(x => x.SortOrder)
                .Select(x => new HomeSliderDto
                {
                    Id = x.Id,
                    HomePosition = x.HomePosition,
                    Title = x.Title,
                    Link = x.Link,
                    Details = x.Details,
                    BrandLogoUrl = x.BrandLogoUrl,
                    SliderImageUrl = x.SliderImageUrl,
                    IsActive = x.IsActive,
                    SortOrder = x.SortOrder
                })
                .ToListAsync();
        }

        // ================= UPSERT =================
        public async Task UpsertAsync(HomeSliderUpsertDto dto)
        {
            HomeSlider slider;

            if (dto.Id.HasValue)
            {
                slider = await _repo.GetByIdAsync(dto.Id.Value)
                    ?? throw new Exception("Slider not found");
            }
            else
            {
                slider = new HomeSlider
                {
                    HomePosition = dto.HomePosition,
                    IsActive = true
                };
                await _repo.AddAsync(slider);
            }

            slider.Title = dto.Title;
            slider.Link = dto.Link;
            slider.Details = dto.Details;
            slider.HomePosition = dto.HomePosition;
            slider.SortOrder = dto.SortOrder;
            slider.IsActive = dto.IsActive;

            // ---------- Brand Logo ----------
            if (dto.BrandLogo != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage,
                    "HomeSliderBrand",
                    slider.Id,
                    CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.BrandLogo },
                    "HomeSliderBrand",
                    slider.Id,
                    "brand_",
                    CancellationToken.None);

                slider.BrandLogoUrl = upload.First().DocPath;
            }

            // ---------- Slider Image ----------
            if (dto.SliderImage != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage,
                    "HomeSlider",
                    slider.Id,
                    CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.SliderImage },
                    "HomeSlider",
                    slider.Id,
                    "slider_",
                    CancellationToken.None);

                slider.SliderImageUrl = upload.First().DocPath;
            }

            slider.SetUpdated();
            await _uow.CommitAsync();
        }

        // ================= DELETE =================
        public async Task DeleteAsync(Guid id)
        {
            var slider = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Slider not found");

            await _fileStorage.DeletePrevFilesAsync(
                EnumDocType.HomePage,
                "HomeSlider",
                slider.Id,
                CancellationToken.None);

            await _repo.DeleteAsync(x => x.Id == id); // ✅ FIX
            await _uow.CommitAsync();
        }
    }
}
