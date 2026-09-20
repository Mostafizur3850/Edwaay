using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class CategoryMetaKeyword : BaseEntity
    {
        [Required]
        public Guid CategoryId { get; set; }

        [Required, MaxLength(100)]
        public string Keyword { get; set; }   
        public Category Category { get; set; }
    }
}
