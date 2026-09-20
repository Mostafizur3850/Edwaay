using System;
using System.Collections.Generic;

namespace ECommerce.Domain.Entities
{
    public class Job : BaseEntity
    {
        public string Title { get; set; } = default!;
        public string Company { get; set; } = default!;
        public string Location { get; set; } = default!;
        public string Salary { get; set; } = default!;
        public string Type { get; set; } = "Full-time"; // "Full-time" | "Part-time" | "Internship" | "Contract"
        public string Destination { get; set; } = "Portal"; // "Portal" | "Career"
        public bool IsFeatured { get; set; }
        public string? Description { get; set; }
        public string? Requirements { get; set; }
        public string? Responsibilities { get; set; }
        public string? Benefits { get; set; }
        public string? Category { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? CompanyLogo { get; set; }

        public Guid? CompanyId { get; set; }
        public Guid? CategoryId { get; set; }

        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}
