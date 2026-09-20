using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services
{
    public class RoleWiseMenuService : IRoleWiseMenuService
    {
        private readonly IBaseRepository<MenuItem> _menuItemRepository;
        private readonly IBaseRepository<ApplicationRoleMenu> _roleMenuRepository;
        private readonly AppDbContext _db;
        public RoleWiseMenuService(IBaseRepository<MenuItem> menuItemRepository,
            IBaseRepository<ApplicationRoleMenu> roleMenuRepository,
            AppDbContext db)
        {
            _menuItemRepository = menuItemRepository;
            _roleMenuRepository = roleMenuRepository;
            _db = db;
        }

        public async Task<List<MenuTreeDto>> GetMenuTreeByRoleIdAsync(string roleId, CancellationToken ct)
        {
            // 1) allowed menu ids
            var allowedIds = await _db.ApplicationRoleMenus
                .Where(x => x.RoleId == roleId)
                .Select(x => x.MenuId)
                .ToListAsync(ct);

            // 2) load all active menus (for parent include)
            var allMenus = await _db.MenuItems
                .AsNoTracking()
                .Where(m => m.IsActive)
                .Select(m => new MenuTreeDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Url = m.Url,
                    Icon = m.Icon,
                    WithoutView = m.WithoutView,
                    ParentId = m.ParentId == 0 ? null : m.ParentId,
                    Sequence = m.Sequence
                })
                 .ToListAsync(ct);

            // 2.5) load permissions
            var permissions = await _db.RoleMenuPermissions
                .AsNoTracking()
                .Where(x => x.RoleId == roleId)
                .GroupBy(x => x.MenuId)
                .ToDictionaryAsync(g => g.Key, g => g.Select(x => x.PermissionId).ToList(), ct);

            foreach (var menu in allMenus)
            {
                if (permissions.TryGetValue(menu.Id, out var permList))
                {
                    menu.Permissions = permList;
                }
            }

            var byId = allMenus.ToDictionary(x => x.Id, x => x);

            // 3) include parents too (child allowed হলে parent menu show করতে হবে)
            var include = new HashSet<int>(allowedIds);
            foreach (var id in allowedIds)
            {
                if (!byId.TryGetValue(id, out var node)) continue;

                var p = node.ParentId;
                while (p != null && byId.TryGetValue(p.Value, out var parent))
                {
                    include.Add(parent.Id);
                    p = parent.ParentId;
                }
            }

            var filtered = allMenus.Where(x => include.Contains(x.Id)).ToList();

            // 4) build tree
            var filteredById = filtered.ToDictionary(x => x.Id, x => x);
            foreach (var n in filtered)
            {
                if (n.ParentId != null && filteredById.TryGetValue(n.ParentId.Value, out var parent))
                    parent.Children.Add(n);
            }

            var roots = filtered
                .Where(x => x.ParentId == null)
                .OrderBy(x => x.Sequence)
                .ToList();

            // sort children
            void Sort(MenuTreeDto node)
            {
                node.Children = node.Children.OrderBy(x => x.Sequence).ToList();
                foreach (var c in node.Children) Sort(c);
            }
            foreach (var r in roots) Sort(r);

            return roots;
        }

    }
}
