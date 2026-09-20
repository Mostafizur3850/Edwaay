using System;
using System.Collections.Generic;

namespace ECommerce.Domain.Entities
{
    public class QuizCategory : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string? Slug { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<QuizSubject> Subjects { get; set; } = new List<QuizSubject>();
    }
}
