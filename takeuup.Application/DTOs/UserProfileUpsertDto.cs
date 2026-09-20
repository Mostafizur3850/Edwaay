using Microsoft.AspNetCore.Http;
using System;

namespace ECommerce.Application.DTOs
{
    public class UserProfileUpsertDto
    {
        public string Name { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public bool IsSubscribed { get; set; }

        public IFormFile? ProfileImage { get; set; }

        public int Streak { get; set; }
        public int Points { get; set; }
        public string? StudentClass { get; set; }
        public string? SelectedSubjectsJson { get; set; }
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
