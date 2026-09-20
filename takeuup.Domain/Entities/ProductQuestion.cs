using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    [Table("ProductQuestions", Schema = "dbo")]
    public class ProductQuestion : BaseEntity
    {
        [Required]
        public Guid ProductId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Question { get; set; } = string.Empty;
        public string? Answer { get; set; }
        public bool IsApproved { get; set; } = false;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
