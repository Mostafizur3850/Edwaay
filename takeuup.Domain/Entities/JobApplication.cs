using System;

namespace ECommerce.Domain.Entities
{
    public class JobApplication : BaseEntity
    {
        public Guid JobId { get; set; }
        public Job Job { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string CVPath { get; set; } = default!;
        public string Status { get; set; } = "Applied"; // "Applied" | "Reviewed" | "Email Sent" | "Rejected"
        public int? TestScore { get; set; }
        public string? InterviewDetails { get; set; } // JSON details (Date, Time, Type, Link, Location, Message)
    }
}
