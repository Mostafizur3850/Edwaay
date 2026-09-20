using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class EventService : IEventService
    {
        private readonly IBaseRepository<Event> _eventRepo;
        private readonly IBaseRepository<EventCategory> _categoryRepo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _uow;

        public EventService(IBaseRepository<Event> eventRepo, IBaseRepository<EventCategory> categoryRepo, IFileStorageService fileStorage, IUnitOfWork uow)
        {
            _eventRepo = eventRepo;
            _fileStorage = fileStorage;
            _uow = uow;
            _categoryRepo = categoryRepo;
        }

        public async Task<List<EventListDto>> GetAllAsync()
        {
            return await _eventRepo.All
                .Select(x => new EventListDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Slug = x.Slug,
                    ImageUrl = x.ImageUrl,
                    Location = x.Location,
                    EventDate = x.EventDate
                }).ToListAsync();
        }

        public async Task CreateAsync(EventCreateUpdateDto dto, CancellationToken ct)
        {
            using var transaction = await _uow.BeginTransactionAsync(ct);

            // Slug Logic
            var baseSlug = SlugHelper.Generate(dto.Title);
            var slug = baseSlug;
            int i = 1;
            while (await _eventRepo.AnyAsync(x => x.Slug == slug, ct))
                slug = $"{baseSlug}-{i++}";

            var newEvent = new Event
            {
                Title = dto.Title,
                Slug = slug,
                Description = dto.Description,
                Location = dto.Location,
                EventDate = dto.EventDate,
                IsActive = dto.IsActive,
                ImageUrl = ""
            };

            await _eventRepo.AddAsync(newEvent);
            await _eventRepo.SaveChangesAsync(ct);

            // Image Logic
            if (dto.Image?.Any() == true)
            {
                var docs = await _fileStorage.UploadImageAsync(dto.Image, "Events", newEvent.Id, "evt_", ct);
                newEvent.ImageUrl = docs.LastOrDefault()?.DocPath;
                _eventRepo.Update(newEvent);
                await _eventRepo.SaveChangesAsync(ct);
            }

            await transaction.CommitAsync(ct);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _eventRepo.GetByIdAsync(id);
            if (entity != null)
            {
                _eventRepo.Delete(entity);
                await _eventRepo.SaveChangesAsync();
            }
        }

        public async Task<EventListDto> GetBySlugAsync(string slug)
        {
            var x = await _eventRepo.All.FirstOrDefaultAsync(e => e.Slug == slug);
            return x == null ? null : new EventListDto
            {
                Id = x.Id,
                Title = x.Title,
                Slug = x.Slug,
                ImageUrl = x.ImageUrl,
                Location = x.Location,
                EventDate = x.EventDate,
                Description=x.Description
            };
        }




        public async Task<List<EventCategoryDto>> GetAllCategoriesAsync()
        {
            return await _categoryRepo.All
                .Where(x => x.IsActive)
                .Select(x => new EventCategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Slug = x.Slug,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task CreateCategoryAsync(EventCategoryCreateDto dto, CancellationToken ct = default)
        {
            var baseSlug = SlugHelper.Generate(dto.Name);
            var slug = baseSlug;
            var i = 1;

            // 'ct' parameter-ti AnyAsync e pass kora hoyeche
            while (await _categoryRepo.AnyAsync(x => x.Slug == slug, ct))
            {
                slug = $"{baseSlug}-{i++}";
            }

            var category = new EventCategory
            {
                Name = dto.Name,
                Slug = slug,
                IsActive = dto.IsActive
            };

            await _categoryRepo.AddAsync(category);

            // SaveChangesAsync e-o 'ct' pass kora bhalo
            await _categoryRepo.SaveChangesAsync(ct);
        }

        public async Task DeleteCategoryAsync(Guid id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category != null)
            {
                _categoryRepo.Delete(category);
                await _categoryRepo.SaveChangesAsync();
            }
        }

        // --- FILTER BY CATEGORY ---

        public async Task<List<EventListDto>> GetByEventCategorySlugAsync(string slug)
        {
            return await _eventRepo.All
                .Include(x => x.EventCategory)
                .Where(x => x.EventCategory.Slug == slug)
                .Select(x => new EventListDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    ImageUrl = x.ImageUrl,
                    Location = x.Location,
                    EventDate = x.EventDate,
                    Slug = x.Slug
                })
                .ToListAsync();
        }
    }
}

