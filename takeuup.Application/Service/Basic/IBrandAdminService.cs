using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IBrandAdminService
    {
        Task<IdNameDto> CreateAsync(string name, CancellationToken ct);
        Task<IdNameDto?> UpdateAsync(string id, string name, CancellationToken ct);
        Task<bool> DeleteAsync(string id, CancellationToken ct);
    }

}
