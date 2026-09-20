using System;

namespace ECommerce.Domain.Entities
{
    public class UserQuizResult : BaseEntity
    {
        public string UserId { get; set; } = default!;
        public string Category { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public DateTimeOffset CompletedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
