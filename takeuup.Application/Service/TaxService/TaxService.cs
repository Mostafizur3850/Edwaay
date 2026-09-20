using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Hosting;


namespace ECommerce.Application.Service
{
    public class TaxService : ITaxService
    {
        private readonly IBaseRepository<Tax> _taxRepository;
        private readonly IUnitOfWork _unitOfWork;

        public TaxService(
            IBaseRepository<Tax> taxRepository,
            IUnitOfWork unitOfWork)
        {
            _taxRepository = taxRepository;
            _unitOfWork = unitOfWork;
        }

        // ---------------- CREATE ----------------
        public async Task<Guid> CreateAsync(CreateTaxDto dto, CancellationToken ct)
        {
            // optional: prevent duplicate tax name
            var exists = await _taxRepository.AnyAsync(
                x => x.Name == dto.Name,
                ct
            );

            if (exists)
                throw new Exception("Tax with same name already exists");

            var tax = new Tax
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Rate = dto.Rate,
                IsActive = true
            };

            await _taxRepository.AddAsync(tax, ct);
            await _unitOfWork.CommitAsync(ct);

            return tax.Id;
        }

        // ---------------- READ ----------------
        public async Task<List<TaxDto>> GetAllAsync(CancellationToken ct)
        {
            return await _taxRepository.All
                .AsNoTracking()
                .Select(t => new TaxDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Rate = t.Rate,
                    IsActive = t.IsActive
                })
                .ToListAsync(ct);
        }

        public async Task<TaxDto?> GetByIdAsync(Guid id, CancellationToken ct)
        {
            return await _taxRepository.All
                .AsNoTracking()
                .Where(t => t.Id == id)
                .Select(t => new TaxDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Rate = t.Rate,
                    IsActive = t.IsActive
                })
                .FirstOrDefaultAsync(ct);
        }

        // ---------------- UPDATE ----------------
        public async Task UpdateAsync(Guid id, UpdateTaxDto dto, CancellationToken ct)
        {
            var tax = await _taxRepository.GetAsync(
                x => x.Id == id,
                ct: ct
            );

            if (tax is null)
                throw new Exception("Tax not found");

            tax.Name = dto.Name;
            tax.Rate = dto.Rate;
            tax.IsActive = dto.IsActive;

            _taxRepository.Update(tax);
            await _unitOfWork.CommitAsync(ct);
        }

        // ---------------- DELETE ----------------
        public async Task DeleteAsync(Guid id, CancellationToken ct)
        {
            await _taxRepository.DeleteAsync(
                x => x.Id == id,
                ct
            );

            await _unitOfWork.CommitAsync(ct);
        }
    }
}