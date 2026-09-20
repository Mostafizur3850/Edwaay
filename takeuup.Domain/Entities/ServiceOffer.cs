using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public sealed class ServiceOffer : BaseEntity
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = default!;

        [Required]
        [MaxLength(1000)]
        public string Details { get; set; } = default!;

        [MaxLength(255)]
        public string? ServiceLogo { get; set; }
    }
}
