using System;

namespace ECommerce.Domain.Entities
{
    public class Question : BaseEntity
    {
        public string AccessLevel { get; set; } = "Free"; // "Free" | "Premium"
        public string Category { get; set; } = default!;   // "HSC" | "Admission" | "Job Prep" | "BCS"
        public string Subject { get; set; } = default!;    // e.g. "Physics", "Chemistry"
        public string Text { get; set; } = default!;
        public string OptionsJson { get; set; } = default!; // JSON array of options
        public string CorrectAnswer { get; set; } = default!; // Index (e.g. "0", "1")
        public string? Explanation { get; set; }
        public string? Exam { get; set; }
        public string? CreatedBy { get; set; }
        public string Status { get; set; } = "Pending"; // "Pending" | "Approved" | "CorrectionRequested"
        public string? ApprovedBy { get; set; }
        public string? CorrectionComment { get; set; }
    }
}
