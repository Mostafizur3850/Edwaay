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
    public class FaqService : IFaqService
    {
        private readonly IBaseRepository<Faq> _repo;

        public FaqService(IBaseRepository<Faq> repo)
        {
            _repo = repo;
        }

        public async Task<List<FaqListDto>> GetAllAsync()
        {
            return await _repo.All
                .Include(x => x.Category)
                .Select(x => new FaqListDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    CategoryName = x.Category.Name,
                    CategoryId = x.CategoryId,
                    Details =x.Details,
                    IsActive = x.IsActive
                }).ToListAsync();
        }

        public async Task CreateAsync(FaqCreateUpdateDto dto)
        {
            await _repo.AddAsync(new Faq
            {
                Title = dto.Title,
                CategoryId = dto.CategoryId,
                Details = dto.Details,
                IsActive = dto.IsActive
            });
            await _repo.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, FaqCreateUpdateDto dto)
        {
            var faq = await _repo.GetByIdAsync(id);
            if (faq == null) throw new Exception("FAQ not found");

            faq.Title = dto.Title;
            faq.CategoryId = dto.CategoryId;
            faq.Details = dto.Details;
            faq.IsActive = dto.IsActive;
            faq.UpdatedAt = DateTimeOffset.UtcNow;

            _repo.Update(faq);
            await _repo.SaveChangesAsync();
        }

        public async Task ToggleStatusAsync(Guid id)
        {
            var faq = await _repo.GetByIdAsync(id);
            if (faq == null) return;

            faq.IsActive = !faq.IsActive;
            _repo.Update(faq);
            await _repo.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var faq = await _repo.GetByIdAsync(id);
            if (faq == null) return;

            _repo.Delete(faq);
            await _repo.SaveChangesAsync();
        }
    }

}
