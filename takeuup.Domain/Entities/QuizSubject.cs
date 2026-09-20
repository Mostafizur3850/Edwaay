using System;

namespace ECommerce.Domain.Entities
{
    public class QuizSubject : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string? Slug { get; set; }
        public Guid QuizCategoryId { get; set; }
        public QuizCategory? QuizCategory { get; set; }
        public bool IsActive { get; set; } = true;
        public string? PendingName { get; set; }
    }
}
