using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service.MaintenanceService
{
    public interface IMaintenanceService
    {
        Task<MaintenanceDto> GetAsync();
        Task UpdateAsync(MaintenanceUpdateDto dto);
    }
}
