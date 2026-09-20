using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class ContactSetting : BaseEntity
    {
        public string StoreAddress { get; set; } = null!;
        public string StorePhone { get; set; } = null!;
        public string StoreEmail { get; set; } = null!;
        public string GatewayImagePath { get; set; } = null!;
        public string CopyrightText { get; set; } = null!;
        public string LogoPath { get; set; } = null!;
        public Guid GeneralSettingId { get; set; }
        public GeneralSetting GeneralSetting { get; set; } = null!;
        public ICollection<SocialLink> SocialLinks { get; set; } = new List<SocialLink>();
        public ICollection<WorkingHour> WorkingHours { get; set; } = new List<WorkingHour>();
    }
}
