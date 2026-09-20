using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using ECommerce.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ECommerce.API.Filters
{
    public enum PermissionType
    {
        View = 1,
        Create = 2,
        Edit = 3,
        Delete = 4
    }

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class HasPermissionAttribute : TypeFilterAttribute
    {
        public HasPermissionAttribute(string menuUrl, PermissionType permission) 
            : base(typeof(PermissionFilter))
        {
            Arguments = new object[] { menuUrl, permission };
        }

        public HasPermissionAttribute() 
            : base(typeof(PermissionFilter))
        {
            Arguments = new object[] { "", (PermissionType)0 };
        }
    }

    [AttributeUsage(AttributeTargets.Method)]
    public class BypassPermissionAttribute : Attribute {}

    public class PermissionFilter : IAsyncAuthorizationFilter
    {
        private readonly string _menuUrl;
        private readonly PermissionType _permission;
        private readonly AppDbContext _dbContext;
        private readonly RoleManager<IdentityRole> _roleManager;

        public PermissionFilter(string menuUrl, PermissionType permission, AppDbContext dbContext, RoleManager<IdentityRole> roleManager)
        {
            _menuUrl = menuUrl;
            _permission = permission;
            _dbContext = dbContext;
            _roleManager = roleManager;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Bypass if action has [AllowAnonymous]
            if (context.ActionDescriptor.EndpointMetadata.Any(em => em is Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute))
            {
                return;
            }

            // Bypass if action has [BypassPermission]
            if (context.ActionDescriptor.EndpointMetadata.Any(em => em is BypassPermissionAttribute))
            {
                return;
            }

            var user = context.HttpContext.User;
            if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // If the user has "Admin" role, bypass all checks and allow access
            if (user.IsInRole("Admin"))
            {
                return;
            }

            // Find user's role claim
            var roleName = user.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleName))
            {
                context.Result = new ForbidResult();
                return;
            }

            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                context.Result = new ForbidResult();
                return;
            }

            string menuUrl = _menuUrl;
            PermissionType permission = _permission;

            // If dynamic, resolve from Request Header and HTTP Method
            if (string.IsNullOrEmpty(menuUrl) && (int)permission == 0)
            {
                var headerVal = context.HttpContext.Request.Headers["X-Menu-Url"].ToString();
                if (string.IsNullOrEmpty(headerVal))
                {
                    // Forbid if header is missing
                    context.Result = new ForbidResult();
                    return;
                }
                menuUrl = headerVal;

                var httpMethod = context.HttpContext.Request.Method.ToUpperInvariant();
                permission = httpMethod switch
                {
                    "GET" => PermissionType.View,
                    "POST" => PermissionType.Create,
                    "PUT" => PermissionType.Edit,
                    "PATCH" => PermissionType.Edit,
                    "DELETE" => PermissionType.Delete,
                    _ => PermissionType.View
                };
            }

            // Find MenuItem by URL (or Title as a fallback)
            var menuItem = await _dbContext.MenuItems
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Url == menuUrl || m.Title == menuUrl);

            if (menuItem == null)
            {
                context.Result = new ForbidResult();
                return;
            }

            // Check if there is an entry in RoleMenuPermissions for the user's role, menu, and specific permission ID
            var hasPermission = await _dbContext.RoleMenuPermissions
                .AnyAsync(rmp => rmp.RoleId == role.Id && rmp.MenuId == menuItem.Id && rmp.PermissionId == (int)permission);

            if (!hasPermission)
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}
