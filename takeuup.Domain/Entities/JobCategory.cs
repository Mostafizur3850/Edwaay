using System;

namespace ECommerce.Domain.Entities
{
    public class JobCategory : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public bool IsActive { get; set; } = true;
    }
}
