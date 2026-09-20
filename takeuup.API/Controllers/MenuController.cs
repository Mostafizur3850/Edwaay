using AutoMapper;
using System.Linq;
using ECommerce.API.Filters;
using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [HasPermission]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;
        private readonly IMapper _mapper; 
        private readonly IRoleWiseMenuService _roleWiseMenuService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public MenuController(IMenuService menuService, IMapper mapper, IRoleWiseMenuService roleWiseMenuService,
        UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _menuService = menuService;
            _mapper = mapper;
            _roleWiseMenuService = roleWiseMenuService;
            _roleManager = roleManager;
        }
        [HttpGet("getAll")]
        [Authorize]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var menus = await _menuService.GetAllMenuAsync(ct);
            return Ok(menus);
        }
        [HttpGet]
        [Route("GetDBMenuList")]
        public IActionResult GetDBMenuList(string userCode, int roleId)
        {
            var menuList = _menuService.GetAllMenu();
            ResponseMessageDTO responseMessage = new ResponseMessageDTO();
            responseMessage.StatusCode = 1;
            responseMessage.Message = "Menu List";
            responseMessage.ResponseObj = menuList;
            return Ok(responseMessage);
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(MenuDTO newMenu)
        {
            if (!ModelState.IsValid) return BadRequest(new { isSuccess = false, message = "Something Went Wrong" });
            
            var existing = _menuService.GetAllMenu().FirstOrDefault(m => m.Url.ToLower().Trim() == newMenu.Url.ToLower().Trim());
            if (existing != null)
            {
                return Ok(new { isSuccess = true, message = "Menu already exists.", menu = existing });
            }
            
            try
            {
                var menu = _mapper.Map<MenuItem>(newMenu);
                menu.IsActive = true;
                _menuService.AddMenu(menu);
                await _menuService.SaveMenuAsync();
                return Ok(new { isSuccess = true, message = "Menu has been saved successfully." });
            }
            catch (Exception ex)
            {
                if (ex.ToString().Contains("IX_MenuItems_Url") || ex.ToString().Contains("duplicate key"))
                {
                    return Ok(new { isSuccess = true, message = "Menu already exists (caught unique constraint)." });
                }
                throw;
            }
        }
        [HttpGet]
        [Route("edit/{id}")]
        public IActionResult Edit(int id)
        {
            var menu = _menuService.GetMenuById(id);
            return Ok(menu);
        }
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] MenuDTO newMenu)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { isSuccess = false, message = "Something Went Wrong" });
            if (newMenu == null)
                return BadRequest(new { isSuccess = false, message = "No Menu data found to update." });
            
            var duplicate = _menuService.GetAllMenu().FirstOrDefault(m => m.Id != newMenu.Id && m.Url.ToLower().Trim() == newMenu.Url.ToLower().Trim());
            if (duplicate != null)
            {
                return BadRequest(new { isSuccess = false, message = "Another menu item with this URL already exists." });
            }
            
            try
            {
                var existingMenu = _menuService.GetMenuById(newMenu.Id);
                existingMenu.Title = newMenu.Title;
                existingMenu.Description = newMenu.Description;
                existingMenu.ParentId = newMenu.ParentId;
                existingMenu.Url = newMenu.Url;
                existingMenu.WithoutView = newMenu.WithoutView;
                existingMenu.Icon = newMenu.Icon;
                existingMenu.Sequence = Convert.ToInt16(newMenu.Sequence);
                _menuService.UpdateMenu(existingMenu);
                await _menuService.SaveMenuAsync(); // ✅ await
                return Ok(new { isSuccess = true, message = "Menu has been updated successfully." });
            }
            catch (Exception ex)
            {
                if (ex.ToString().Contains("IX_MenuItems_Url") || ex.ToString().Contains("duplicate key"))
                {
                    return BadRequest(new { isSuccess = false, message = "Another menu item with this URL already exists." });
                }
                throw;
            }
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
           await _menuService.DeleteMenu(id);
            await _menuService.SaveMenuAsync(); // âœ… await
            return Ok(new { isSuccess = true, message = "Menu has been deleted successfully." });
        }
        [HttpGet("my")]
        [BypassPermission]
        public async Task<IActionResult> MyMenus(CancellationToken ct)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return Unauthorized();
            var roles = await _userManager.GetRolesAsync(user);
            var roleName = roles.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(roleName))
                return Unauthorized(new { message = "User has no role." });
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role is null)
                return Unauthorized(new { message = "Role not found in db." });
            var roleId = role.Id; // string
            var menus = await _roleWiseMenuService.GetMenuTreeByRoleIdAsync(roleId, ct);
            return Ok(new { statusCode = 1, message = "Menu List", responseObj = menus });
        }
    }
}
