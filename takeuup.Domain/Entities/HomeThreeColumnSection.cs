using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomeThreeColumnSection : BaseEntity
    {
        public string SectionTitle { get; set; } = null!;
        public bool IsActive { get; set; }

        public ICollection<HomeThreeColumnItem> Categories { get; set; }
            = new List<HomeThreeColumnItem>();
    }

}
