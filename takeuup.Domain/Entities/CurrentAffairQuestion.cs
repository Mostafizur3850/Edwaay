using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities
{
    public class CurrentAffairQuestion
    {
        [Key]
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string CorrectOption { get; set; } // 'A', 'B', 'C', or 'D'
        public string Explanation { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
