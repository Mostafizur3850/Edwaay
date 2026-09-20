using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class FaqCategoryService : IFaqCategoryService
    {
        private readonly IBaseRepository<FaqCategory> _repo;

        public FaqCategoryService(IBaseRepository<FaqCategory> repo)
        {
            _repo = repo;
        }

        public async Task<List<FaqCategoryDto>> GetAllAsync()
        {
            return await _repo.All
                .Select(x => new FaqCategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsActive = x.IsActive
                }).ToListAsync();
        }

        public async Task CreateAsync(FaqCategoryCreateDto dto)
        {
            await _repo.AddAsync(new FaqCategory
            {
                Name = dto.Name
            });
            await _repo.SaveChangesAsync();
        }

        public async Task ToggleStatusAsync(Guid id)
        {
            var cat = await _repo.GetByIdAsync(id);
            if (cat == null) return;

            cat.IsActive = !cat.IsActive;
            _repo.Update(cat);
            await _repo.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var cat = await _repo.GetByIdAsync(id);
            if (cat == null) return;

            _repo.Delete(cat);
            await _repo.SaveChangesAsync();
        }
    }

}
