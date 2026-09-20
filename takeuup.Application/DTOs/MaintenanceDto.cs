using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class MaintenanceDto
    {
        public Guid Id { get; set; }
        public bool IsMaintenanceMode { get; set; }
        public string? ImageUrl { get; set; }
        public string MaintenanceText { get; set; } = string.Empty;
    }

    public class MaintenanceUpdateDto
    {
        public bool IsMaintenanceMode { get; set; }
        public string MaintenanceText { get; set; } = string.Empty;

        public IFormFile? ImageFile { get; set; }
    }
}
