using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class SiteMetaKeyword : BaseEntity
    {
        public string Keyword { get; set; } = null!;

        // FK
        public Guid GeneralSettingId { get; set; }
        public GeneralSetting GeneralSetting { get; set; } = null!;
    }
}
