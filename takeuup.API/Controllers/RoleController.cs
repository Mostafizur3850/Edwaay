using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[Route("api/[controller]")]
[ApiController]
[Authorize]
[HasPermission]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;
    public RoleController(IRoleService roleService)
    {
        _roleService = roleService;
    }
    [HttpPost]
    [HttpPost("create")]
    public async Task<IActionResult> Create(RoleCreateDto dto)
    {
        await _roleService.CreateRoleAsync(dto);
        return Ok("Role created successfully");
    }
    [HttpGet("GetAll")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _roleService.GetAllRolesAsync();       
        return Ok(roles);
    }
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(RoleCreateDto dto)
    {
        await _roleService.UpdateRoleAsync(dto);
        return Ok("Role updated successfully");
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        await _roleService.DeleteRoleAsync(id);
        return Ok("Role deleted successfully");
    }
    [HttpPost("assignMenu")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignMenu(RoleMenuAssignDto dto)
    {
        await _roleService.AssignMenuToRoleAsync(dto);
        return Ok("Menu assigned to role successfully");
    }
    [HttpGet("{roleId}/permissions")]
    public async Task<ActionResult<List<MenuPermissionDto>>> GetRolePermissions(string roleId)
    {
        try
        {
            var permissions = await _roleService.GetRolePermissionsAsync(roleId);
            return Ok(permissions);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
