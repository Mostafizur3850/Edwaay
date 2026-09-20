using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class UserProfile : BaseEntity
    {      
        public Guid UserId { get; set; }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public string ProfileImageUrl { get; set; }
        public bool IsSubscribed { get; set; }

        public int Streak { get; set; } = 0;
        public int Points { get; set; } = 0;
        public string? StudentClass { get; set; }
        public string? SelectedSubjectsJson { get; set; }

        public bool IsTeacherApproved { get; set; } = false;
        public string? Institution { get; set; }
        public string? Qualification { get; set; }
        public string? Bio { get; set; }
        public bool IsProfileCompleted { get; set; } = false;

        public string? TargetGoalsJson { get; set; }
        public string? UnlockedGoalsJson { get; set; }
        public string? GoalProgressJson { get; set; }
        public string? RoutineTasksJson { get; set; }
        public string? MistakesJson { get; set; }

        public Guid? ActiveGoalCategoryId { get; set; }
        public string? ActiveGoalName { get; set; }
        public bool HasSelectedInitialGoal { get; set; } = false;
 
        public ApplicationUser User { get; set; }
    }

}
