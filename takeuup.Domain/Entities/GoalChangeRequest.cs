using System;

namespace ECommerce.Domain.Entities
{
    public class GoalChangeRequest : BaseEntity
    {
        public Guid UserId { get; set; }
        public string StudentName { get; set; } = default!;
        public string StudentEmail { get; set; } = default!;
        public Guid CurrentGoalCategoryId { get; set; }
        public string CurrentGoalName { get; set; } = default!;
        public Guid RequestedGoalCategoryId { get; set; }
        public string RequestedGoalName { get; set; } = default!;
        public string Reason { get; set; } = default!;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public string? AdminNote { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTimeOffset? ReviewedAt { get; set; }
    }
}
