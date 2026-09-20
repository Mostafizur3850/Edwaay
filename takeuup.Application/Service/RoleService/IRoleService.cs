using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IRoleService
    {
        Task CreateRoleAsync(RoleCreateDto dto);
        Task<List<RoleCreateDto>> GetAllRolesAsync();
        Task UpdateRoleAsync(RoleCreateDto dto);           
        Task DeleteRoleAsync(string roleId);           
        Task AssignMenuToRoleAsync(RoleMenuAssignDto dto);

        Task<List<MenuPermissionDto>> GetRolePermissionsAsync(string roleId);
    }
}
