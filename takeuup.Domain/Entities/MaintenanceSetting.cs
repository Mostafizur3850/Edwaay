using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class MaintenanceSetting : BaseEntity
    {

        public bool IsMaintenanceMode { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        [Required]
        [MaxLength(1000)]
        public string MaintenanceText { get; set; } = string.Empty;
    }
}
