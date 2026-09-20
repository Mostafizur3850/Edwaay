using System;

namespace ECommerce.Domain.Entities
{
    public class AboutUsSettings : BaseEntity
    {
        public string HeroTitle { get; set; } = default!;
        public string HeroSubtitle { get; set; } = default!;
        public string HeroTitleBn { get; set; } = default!;
        public string HeroTitleEn { get; set; } = default!;
        public string HeroSubtitleBn { get; set; } = default!;
        public string HeroSubtitleEn { get; set; } = default!;
        public string MissionText { get; set; } = default!;
        public string VisionText { get; set; } = default!;
        public string StatsJson { get; set; } = default!;
        public string ValuesJson { get; set; } = default!;
    }
}
