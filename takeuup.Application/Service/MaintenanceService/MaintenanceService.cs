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

namespace ECommerce.Application.Service.MaintenanceService
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly IBaseRepository<MaintenanceSetting> _repo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _uow;

        public MaintenanceService(
            IBaseRepository<MaintenanceSetting> repo,
            IFileStorageService fileStorage,
            IUnitOfWork uow)
        {
            _repo = repo;
            _fileStorage = fileStorage;
            _uow = uow;
        }

        // ================= GET =================
        public async Task<MaintenanceDto> GetAsync()
        {
            var entity = await _repo.All.FirstOrDefaultAsync();

            if (entity == null)
                return new MaintenanceDto
                {
                    IsMaintenanceMode = false,
                    MaintenanceText = string.Empty
                };

            return new MaintenanceDto
            {
                Id = entity.Id,
                IsMaintenanceMode = entity.IsMaintenanceMode,
                ImageUrl = entity.ImageUrl,
                MaintenanceText = entity.MaintenanceText
            };
        }

        // ================= UPDATE =================
        public async Task UpdateAsync(MaintenanceUpdateDto dto)
        {
            var entity = await _repo.All.FirstOrDefaultAsync();

            if (entity == null)
            {
                entity = new MaintenanceSetting();
                await _repo.AddAsync(entity);
            }

            entity.IsMaintenanceMode = dto.IsMaintenanceMode;
            entity.MaintenanceText = dto.MaintenanceText;

            if (dto.ImageFile != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.HomePage,
                    "Maintenance",
                    entity.Id,
                    CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.ImageFile },
                    "Maintenance",
                    entity.Id,
                    "maintenance_",
                    CancellationToken.None);

                entity.ImageUrl = upload.First().DocPath;
            }

            entity.SetUpdated();
            await _uow.CommitAsync();
        }
    }

}
