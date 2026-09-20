using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Service
{
    public interface IMenuService
    {
        void AddMenu(MenuItem menu);
        void AddRoleMenu(ApplicationRoleMenu menu);
        MenuItem GetMenuById(int id);
        IEnumerable<MenuItem> GetAllMenu();
        IEnumerable<ApplicationRoleMenu> GetAllRoleMenu();
        IEnumerable<ApplicationRoleMenu> GetRoleMenuByRoleId(string roleId);
        Task<IEnumerable<Tuple<int, string, string, string, string>>> GetAllMenuAsync();
    
         Task<IReadOnlyList<MenuDTO>> GetAllMenuAsync(CancellationToken ct = default);
  
        Task<IEnumerable<MenuItem>> GetMenuByUserRoleAsync(ICollection<string> roleIds);

        void UpdateMenu(MenuItem menu);
        Task DeleteRoleMenuByRoleId(string id);
        Task DeleteMenu(int id);
        Task SaveMenuAsync();
      

    }
}
