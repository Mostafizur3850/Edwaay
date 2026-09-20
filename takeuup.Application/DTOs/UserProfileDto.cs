using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class UserProfileDto
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfileImageUrl { get; set; }
        public string Email { get; set; }
        public string JoinDate { get; set; }
        public bool IsSubscribed { get; set; }

        public int Streak { get; set; }
        public int Points { get; set; }
        public string? StudentClass { get; set; }
        public string? SelectedSubjectsJson { get; set; }
        public bool IsTeacherApproved { get; set; }
        public bool IsProfileCompleted { get; set; }
        public string? TargetGoalsJson { get; set; }
        public string? UnlockedGoalsJson { get; set; }
        public string? GoalProgressJson { get; set; }
        public string? RoutineTasksJson { get; set; }
        public string? MistakesJson { get; set; }
        public string? Institution { get; set; }
        public string? Qualification { get; set; }
        public string? Bio { get; set; }
    }
}

