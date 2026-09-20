using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICategoryQueryService
    {
        Task<IReadOnlyList<IdNameDto>> GetTreeAsync(CancellationToken ct);
    }
}
