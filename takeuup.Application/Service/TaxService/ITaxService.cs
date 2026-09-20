using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ITaxService
    {
        Task<Guid> CreateAsync(CreateTaxDto dto, CancellationToken ct);
        Task<List<TaxDto>> GetAllAsync(CancellationToken ct);
        Task<TaxDto?> GetByIdAsync(Guid id, CancellationToken ct);
        Task UpdateAsync(Guid id, UpdateTaxDto dto, CancellationToken ct);
        Task DeleteAsync(Guid id, CancellationToken ct);
    }
}
