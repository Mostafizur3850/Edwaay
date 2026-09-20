using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class SocialLink : BaseEntity
    {
        public string IconName { get; set; } = null!;
        public string Url { get; set; } = null!;

        // FK
        public Guid ContactSettingId { get; set; }
        public ContactSetting ContactSetting { get; set; } = null!;
    }
}
