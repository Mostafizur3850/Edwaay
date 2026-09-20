using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class WorkingHour : BaseEntity
    {
        public string DayType { get; set; } = null!; // weekday / weekend
        public TimeSpan FromTime { get; set; }
        public TimeSpan ToTime { get; set; }

        // FK
        public Guid ContactSettingId { get; set; }
        public ContactSetting ContactSetting { get; set; } = null!;
    }
}
