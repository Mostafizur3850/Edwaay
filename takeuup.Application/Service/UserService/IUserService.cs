using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IUserService
    {
        Task CreateUserAsync(UserCreateDto dto);
        Task<List<UserWithRolesDto>> GetAllUsersWithRolesAsync();        
        Task UpdateUserStatusAsync(UserStatusUpdateDto dto);
        Task UpdateUserAsync(UserUpdateDto dto);
        Task DeleteUserAsync(string userId);
    }
    
}
