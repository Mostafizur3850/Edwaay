using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Service
{
    public interface IRoleWiseMenuService
    {
        Task<List<MenuTreeDto>> GetMenuTreeByRoleIdAsync(string roleId, CancellationToken ct);
    }
}
