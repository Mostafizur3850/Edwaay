using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class TaxDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Rate { get; set; }
        public bool IsActive { get; set; }
    }



    public class CreateTaxDto
    {
        public string Name { get; set; } = default!;
        public decimal Rate { get; set; } // %
    }

    public class UpdateTaxDto
    {
        public string Name { get; set; } = default!;
        public decimal Rate { get; set; }
        public bool IsActive { get; set; }
    }

}
