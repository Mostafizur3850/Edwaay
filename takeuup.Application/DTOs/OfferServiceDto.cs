using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public sealed class CreateOfferServiceDto 
    {
        public string Name { get; set; } = default!;
        public string Details { get; set; } = default!;
        public IFormFileCollection ServiceLogo { get; set; } = default!; 
    }

    public sealed class UpdateOfferServiceDto
    {
        public string Name { get; set; } = default!;
        public string Details { get; set; } = default!;
        public IFormFileCollection ServiceLogo { get; set; } = default!;
    }

    public sealed class OfferServiceList
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Details { get; set; } = default!;
        public string? serviceLogo { get; set; }
        public bool IsActive { get; set; }
    }


    public class OfferServiceDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

}
