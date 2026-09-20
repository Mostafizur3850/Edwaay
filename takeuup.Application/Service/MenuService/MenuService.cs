using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore.Metadata;
using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.Service;
using ECommerce.Application.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;
using static ECommerce.Application.DTOs.Auth.AuthRequests;
namespace ECommerce.Application.Service
{
    public class MenuService : IMenuService
    {
        private readonly IBaseRepository<MenuItem> _menuItemRepository;
        private readonly IBaseRepository<ApplicationRoleMenu> _roleMenuRepository;
        private readonly IUnitOfWork _unitOfWork;

        public MenuService(IBaseRepository<MenuItem> menuItemRepository,
            IBaseRepository<ApplicationRoleMenu> roleMenuRepository, IUnitOfWork unitOfWork)
        {
            _menuItemRepository = menuItemRepository;
            _roleMenuRepository = roleMenuRepository;
            _unitOfWork = unitOfWork;
        }

        public void AddMenu(MenuItem menu)
        {
            _menuItemRepository.AddAsync(menu);
        }

        public void AddRoleMenu(ApplicationRoleMenu menu)
        {
            _roleMenuRepository.AddAsync(menu);
        }

        public IEnumerable<MenuItem> GetAllMenu()
        {
            return _menuItemRepository.All;
        }

        public IEnumerable<ApplicationRoleMenu> GetAllRoleMenu()
        {
            return _roleMenuRepository.All;
        }

        public IEnumerable<ApplicationRoleMenu> GetRoleMenuByRoleId(string roleId)
        {
            return _roleMenuRepository.FindBy(x => x.RoleId == roleId);
        }

        public async Task<IEnumerable<Tuple<int, string, string, string, string>>> GetAllMenuAsync()
        {
            return await _menuItemRepository.GetAllMenuAsyncNew();
        }

        public async Task<IReadOnlyList<MenuDTO>> GetAllMenuAsync(CancellationToken ct = default)
        => await _menuItemRepository.GetAllMenuAsync(ct);

        public MenuItem GetMenuById(int id)
        {
            return _menuItemRepository.FindBy(x => x.Id == id).FirstOrDefault();
        }

        public async Task<IEnumerable<MenuItem>> GetMenuByUserRoleAsync(ICollection<string> roleIds)
        {
            return await _menuItemRepository.GetMenuByUserRoleAsync(_roleMenuRepository, roleIds);
        }

        public void UpdateMenu(MenuItem menu)
        {
            _menuItemRepository.Update(menu);
        }

        public async Task  DeleteRoleMenuByRoleId(string id)
        {
            await _roleMenuRepository.DeleteAsync(x=> x.RoleId == id);
        }

        public async Task DeleteMenu(int id)
        {
            await _menuItemRepository.DeleteAsync(x=> x.Id == id);
        }

        public async Task SaveMenuAsync()
        {
            await _unitOfWork.CommitAsync();
        }

      

    }
}
