using System;
using System.Collections.Generic;

namespace ECommerce.Domain.Entities
{
    public class GoalCategory : BaseEntity
    {
        public string Title { get; set; } = default!;
        public string? Subtitle { get; set; }
        public Guid? ParentId { get; set; }
        public string? IconUrl { get; set; }
        public string? IconName { get; set; }
        public int Sequence { get; set; } = 1;
        public bool IsActive { get; set; } = true;

        public GoalCategory? Parent { get; set; }
        public ICollection<GoalCategory> SubCategories { get; set; } = new List<GoalCategory>();
    }
}
