using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class RoleCreateDto
    {
        public string Name { get; set; } = null!;
        public string id { get; set; } = null!;
        public string title { get; set; } = null!;


    }

    public class RoleUpdateDto
    {
        public string RoleId { get; set; } = null!;
        public string Name { get; set; } = null!;
    }

    public class RoleMenuAssignDto
    {
        public string RoleId { get; set; } = null!;
        public List<MenuPermissionDto> Menus { get; set; } = new List<MenuPermissionDto>();
    }

    public class MenuPermissionDto
    {
        public int MenuId { get; set; }
        public List<int> Permissions { get; set; } = new List<int>(); // 1=View,2=Create,3=Edit,4=Delete
    }

    public class RoleMenuAssignItemDto
    {
        public int MenuId { get; set; }
        public List<int> PermissionIds { get; set; } // View, Create, Edit, Delete
    }
}
