using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public static class MenuExtensions
{

       public static async Task<IReadOnlyList<MenuDTO>>
        GetAllMenuAsync(this IBaseRepository<MenuItem> menuRepository, CancellationToken ct = default)
    {
        return await menuRepository.All
            .GroupJoin(
                menuRepository.All,
                m => m.ParentId,
                pm => pm.Id,
                (m, parents) => new { Menu = m, Parents = parents }
            )
            .SelectMany(
                x => x.Parents.DefaultIfEmpty(),
                (x, parent) => new MenuDTO
                {
                    Id = x.Menu.Id,
                    Title = x.Menu.Title ?? "",
                    Description = x.Menu.Description,
                    ParentId = x.Menu.ParentId,
                    Url = x.Menu.Url ?? "",
                    Icon = x.Menu.Icon,
                    Sequence = x.Menu.Sequence,
                    WithoutView = x.Menu.WithoutView,
                    ParentTitle = parent != null ? (parent.Title ?? "") : ""
                }
            )
            .ToListAsync(ct);
    }


    // ✅ Better: null-safe parent title + avoid extra IEnumerable<MenuItem> variable
    public static async Task<IEnumerable<Tuple<int, string, string, string, string>>>
        GetAllMenuAsyncNew(this IBaseRepository<MenuItem> menuRepository, CancellationToken ct = default)
    {
        // Self left join: Menu -> ParentMenu
        var items = await menuRepository.All
            .GroupJoin(
                menuRepository.All,
                m => m.ParentId,
                pm => pm.Id,
                (m, parents) => new { Menu = m, Parents = parents }
            )
            .SelectMany(
                x => x.Parents.DefaultIfEmpty(),
                (x, parent) => new { x.Menu, Parent = parent }
            )
            .Select(x => new
            {
                MenuId = x.Menu.Id,
                MenuTitle = x.Menu.Title ?? "",
                MenuDescription = x.Menu.Description ?? "",
                MenuUrl = x.Menu.Url ?? "",
                ParentTitle = x.Parent != null ? (x.Parent.Title ?? "") : ""
            })
            .ToListAsync(ct);

        return items.Select(x => new Tuple<int, string, string, string, string>(
            x.MenuId,
            x.MenuTitle,
            x.MenuDescription,
            x.MenuUrl,
            x.ParentTitle
        ));
    }

    // ✅ Make it async + remove N+1 + distinct + null-safe
    public static async Task<List<MenuItem>> GetMenuByUserRoleAsync(
        this IBaseRepository<MenuItem> menuRepository,
        IBaseRepository<ApplicationRoleMenu> roleMenuRepository,
        ICollection<string> roleIds,
        CancellationToken ct = default)
    {
        if (roleIds == null || roleIds.Count == 0)
            return new List<MenuItem>();

        // Get allowed menu ids for given roles
        var menuIds = await roleMenuRepository.All
            .Where(r => roleIds.Contains(r.RoleId))
            .Select(r => r.MenuId)
            .Distinct()
            .ToListAsync(ct);

        if (menuIds.Count == 0)
            return new List<MenuItem>();

        // Fetch menus in one query
        var menus = await menuRepository.All
            .Where(m => menuIds.Contains(m.Id))
            .ToListAsync(ct);

        return menus;
    }
}
