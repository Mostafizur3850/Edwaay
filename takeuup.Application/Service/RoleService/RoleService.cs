using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IBaseRepository<MenuItem> _menuItemRepository;
        private readonly IBaseRepository<ApplicationRoleMenu> _roleMenuRepository;
        private readonly IBaseRepository<RoleMenuPermission> _roleMenuPermissionRepository;
        private readonly IUnitOfWork _unitOfWork;
        public RoleService(RoleManager<IdentityRole> roleManager, IBaseRepository<MenuItem> menuItemRepository, IBaseRepository<ApplicationRoleMenu> roleMenuRepository, IUnitOfWork unitOfWork, IBaseRepository<RoleMenuPermission> roleMenuPermissionRepository)
        {
            _roleManager = roleManager;
            _menuItemRepository = menuItemRepository;
            _roleMenuRepository = roleMenuRepository;
            _unitOfWork = unitOfWork;
            _roleMenuPermissionRepository = roleMenuPermissionRepository;
        }

        public async Task CreateRoleAsync(RoleCreateDto dto)
        {           
            if (await _roleManager.RoleExistsAsync(dto.title))
                throw new Exception($"Role '{dto.Name}' already exists.");
            
            var role = new IdentityRole
            {
                Name = dto.title,
                NormalizedName = dto.title.ToUpper() 
            };           
            role.ConcurrencyStamp = Guid.NewGuid().ToString();
            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {               
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task<List<RoleCreateDto>> GetAllRolesAsync()
        {
            return await _roleManager.Roles
                .Select(r => new RoleCreateDto
                {
                    Name = r.Name,
                    title=r.Name,
                    id =r.Id
                })
                .ToListAsync();
        }


        public async Task UpdateRoleAsync(RoleCreateDto dto)
        {
            var role = await _roleManager.FindByIdAsync(dto.id);
            if (role == null)
                throw new Exception("Role not found");

            role.Name = dto.title;
            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));
        }
      
        public async Task DeleteRoleAsync(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
                throw new Exception("Role not found");

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));
        }


        //public async Task AssignMenuToRoleAsync(RoleMenuAssignDto dto)
        //{
        //    var role = await _roleManager.FindByIdAsync(dto.RoleId);
        //    if (role == null)
        //        throw new Exception("Role not found");

        //    var oldMenus = _roleMenuRepository.All
        //        .Where(r => r.RoleId == dto.RoleId)
        //        .ToList();

        //    foreach (var m in oldMenus)
        //        _roleMenuRepository.Remove(m);

        //    var oldPermissions = _roleMenuPermissionRepository.All
        //        .Where(p => p.RoleId == dto.RoleId)
        //        .ToList();

        //    foreach (var p in oldPermissions)
        //        _roleMenuPermissionRepository.Remove(p);
        //    foreach (var menu in dto.Menus)
        //    {
        //        var menuExists = await _menuItemRepository.All
        //            .AnyAsync(x => x.Id == menu.MenuId);
        //        if (!menuExists)
        //            continue;
        //        await _roleMenuRepository.AddAsync(new ApplicationRoleMenu
        //        {
        //            RoleId = dto.RoleId,
        //            MenuId = menu.MenuId
        //        });

        //        foreach (var permission in menu.Permissions)
        //        {
        //            await _roleMenuPermissionRepository.AddAsync(
        //             new RoleMenuPermission
        //             {
        //                 RoleId = dto.RoleId,
        //                 MenuId = menu.MenuId,
        //                 PermissionId = permission
        //             });
        //        }
        //    }

        //    await _unitOfWork.CommitAsync();
        //}

        public async Task AssignMenuToRoleAsync(RoleMenuAssignDto dto)
        {
            var role = await _roleManager.FindByIdAsync(dto.RoleId);
            if (role == null)
                throw new Exception("Role not found");

            // Remove old role menus
            var oldMenus = _roleMenuRepository.All.Where(r => r.RoleId == dto.RoleId).ToList();
            foreach (var m in oldMenus) _roleMenuRepository.Remove(m);

            // Remove old permissions
            var oldPermissions = _roleMenuPermissionRepository.All.Where(p => p.RoleId == dto.RoleId).ToList();
            foreach (var p in oldPermissions) _roleMenuPermissionRepository.Remove(p);

            // Add new menus + permissions
            foreach (var menu in dto.Menus)
            {
                var menuExists = await _menuItemRepository.All.AnyAsync(x => x.Id == menu.MenuId);
                if (!menuExists) continue;

                await _roleMenuRepository.AddAsync(new ApplicationRoleMenu
                {
                    RoleId = dto.RoleId,
                    MenuId = menu.MenuId
                });

                foreach (var permissionId in menu.Permissions)
                {
                    await _roleMenuPermissionRepository.AddAsync(new RoleMenuPermission
                    {
                        RoleId = dto.RoleId,
                        MenuId = menu.MenuId,
                        PermissionId = permissionId
                    });
                }
            }

            await _unitOfWork.CommitAsync();
        }





        public async Task<List<MenuPermissionDto>> GetRolePermissionsAsync(string roleId)
        {
            var data = await _roleMenuPermissionRepository.All
                .Where(rm => rm.RoleId == roleId)
                .GroupBy(rm => rm.MenuId)
                .Select(g => new MenuPermissionDto
                {
                    MenuId = g.Key,
                    Permissions = g.Select(x => x.PermissionId).ToList() 
                })
                .ToListAsync();

            return data;
        }


    }
}
