using System;

namespace ECommerce.Domain.Entities
{
    public class Feedback : BaseEntity
    {
        public string Name { get; set; }
        public string Role { get; set; } // "Guardian" or "Student"
        public string? StudentInfo { get; set; }
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsApproved { get; set; } = true;
    }
}
