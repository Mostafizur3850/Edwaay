using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
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

namespace ECommerce.Application.Service
{
    public class HomeTopAdService : IHomeTopAdService
    {
        private readonly IBaseRepository<HomeTopAd> _repo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _unitOfWork;

        public HomeTopAdService(
            IBaseRepository<HomeTopAd> repo,
            IFileStorageService fileStorage,
            IUnitOfWork unitOfWork)
        {
            _repo = repo;
            _fileStorage = fileStorage;
            _unitOfWork = unitOfWork;
        }

        // ---------- GET (Frontend) ----------
        public async Task<HomeTopAdDto?> GetAsync()
        {
            var ad = await _repo.All.FirstOrDefaultAsync(x => x.IsActive);

            if (ad == null) return null;

            return new HomeTopAdDto
            {
                Id = ad.Id,
                ImageUrl = ad.ImageUrl,
                Title = ad.Title,
                Subtitle = ad.Subtitle,
                Url = ad.Url,
                IsActive = ad.IsActive
            };
        }

        // ---------- UPDATE (Admin) ----------
        public async Task UpdateAsync(HomeTopAdUpdateDto dto)
        {
            var ad = await _repo.All.FirstOrDefaultAsync();

            if (ad == null)
            {
                ad = new HomeTopAd
                {
                    ImageUrl = "",
                    Title = "",
                    Url = "#",
                    IsActive = true
                };

                await _repo.AddAsync(ad);
            }

            if (dto.Title != null) ad.Title = dto.Title;
            if (dto.Subtitle != null) ad.Subtitle = dto.Subtitle;
            if (dto.Url != null) ad.Url = dto.Url;
            if (dto.IsActive.HasValue) ad.IsActive = dto.IsActive.Value;

            // IMAGE
            if (dto.ImageFile != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage,
                    "TopAd",
                    ad.Id,
                    CancellationToken.None);

                var uploaded = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.ImageFile },
                    "TopAd",
                    ad.Id,
                    "topad_",
                    CancellationToken.None);

                ad.ImageUrl = uploaded.First().DocPath;
            }

            ad.SetUpdated();
            await _unitOfWork.CommitAsync();
        }
    }
}
