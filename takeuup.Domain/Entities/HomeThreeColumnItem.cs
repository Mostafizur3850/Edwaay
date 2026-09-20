using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class HomeThreeColumnItem : BaseEntity
    {
        public Guid SectionId { get; set; }
        public HomeThreeColumnSection Section { get; set; } = null!;

        public Guid CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? ChildCategoryId { get; set; }

        public int SortOrder { get; set; }
    }

}
