
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class UserCreateDto
    {
        public string Id { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
        public bool IsActive { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }

    public class UserWithRolesDto
    {
        public string Id { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }  // active/inactive
        public List<string> Roles { get; set; } = new List<string>();
        public int Streak { get; set; }
        public int Points { get; set; }
        public string? StudentClass { get; set; }
        public int QuestionsCount { get; set; }
        public bool IsTeacherApproved { get; set; }
        public bool IsProfileCompleted { get; set; }
        public string? Institution { get; set; }
        public string? Qualification { get; set; }
    }

    public class UserStatusUpdateDto
    {
        public string UserId { get; set; } = null!;
        public bool IsActive { get; set; }
    }

    public class UserUpdateDto
    {
        public string UserId { get; set; } = null!;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; } 
    }


}
