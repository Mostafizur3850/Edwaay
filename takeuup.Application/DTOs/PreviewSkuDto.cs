using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class PreviewSkuDto
    {
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public decimal Price { get; set; }
    }

    public class PreviewSkuResponseDto
    {
        public string Sku { get; set; }
    }


}
