using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IBrandQueryService
    {
        Task<IReadOnlyList<IdNameDto>> GetAllAsync(CancellationToken ct);
    }
}
