using System;

namespace ECommerce.Application.DTOs
{
    public class LeaderboardEntryDto
    {
        public string Id { get; set; }
        public int Rank { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
        public string Avatar { get; set; }
        public string Trend { get; set; }
        public string Institution { get; set; }
    }
}
