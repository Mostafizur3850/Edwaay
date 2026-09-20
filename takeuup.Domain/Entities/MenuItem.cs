using ECommerce.Domain.Repository;
using System;
#nullable enable
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{   
    public class MenuItem 
    {
        public int Id { get; set; }

        public required string Title { get; set; }
        public string? Description { get; set; }

        public int? ParentId { get; set; }                 // ✅ root menu = null
        public MenuItem? Parent { get; set; }              // ✅ self ref
        public ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();

        public required string Url { get; set; }
        public bool WithoutView { get; set; } = false;     // keep your flag
        public string? Icon { get; set; }
        public int Sequence { get; set; }

        public bool IsActive { get; set; } = true;         // ✅ useful for soft control
    }







    public class ApplicationRoleMenu
    {
        public string RoleId { get; set; } = default!;
        public int MenuId { get; set; }

        public MenuItem? Menu { get; set; }
        public ICollection<RoleMenuPermission> Permissions { get; set; } = new List<RoleMenuPermission>();
    }


    public class Permission
    {
        public int Id { get; set; }
        public required string Name { get; set; } // e.g. View, Create, Edit, Delete
    }

    public class RoleMenuPermission
    {
        public string RoleId { get; set; } = default!;
        public int MenuId { get; set; }
        public int PermissionId { get; set; }

        public ApplicationRoleMenu? RoleMenu { get; set; }
        public Permission? Permission { get; set; }
    }

}
