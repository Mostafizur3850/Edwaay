using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomePopularCategorySection : BaseEntity
    {
        public string SectionTitle { get; set; } = null!;
        public bool IsActive { get; set; }

        public ICollection<HomePopularCategoryItem> Categories { get; set; }
            = new List<HomePopularCategoryItem>();
    }

}
