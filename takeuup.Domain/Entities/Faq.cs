using System;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.Domain.Entities
{

    public class Faq : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Details { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        // Navigation
        public FaqCategory Category { get; set; } = null!;
    }

}
