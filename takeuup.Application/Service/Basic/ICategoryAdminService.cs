using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICategoryAdminService
    {
        Task<IdNameDto> CreateAsync(string name, string? parentId, CancellationToken ct);
        Task<IdNameDto?> UpdateAsync(string id, string name, string? parentId, CancellationToken ct);
        Task<bool> DeleteAsync(string id, CancellationToken ct);
    }
}
