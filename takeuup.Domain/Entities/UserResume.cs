using System;

namespace ECommerce.Domain.Entities
{
    public class UserResume : BaseEntity
    {
        public string UserId { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Phone { get; set; } = default!;
        public string? Summary { get; set; }
        
        public string? ExperienceJson { get; set; } // JSON of experience list
        public string? EducationJson { get; set; }  // JSON of education list
        public string? SkillsJson { get; set; }     // JSON of skills list
    }
}
