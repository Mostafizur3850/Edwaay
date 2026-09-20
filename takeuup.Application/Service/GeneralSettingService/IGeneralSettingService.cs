using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IGeneralSettingService
    {
        Task<GeneralSettingDto> GetAsync();
        Task UpdateAsync(GeneralSettingUpdateDto dto);
    }
}
