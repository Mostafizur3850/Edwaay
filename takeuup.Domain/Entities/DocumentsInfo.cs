using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    [Table("DocumentsInfo")]
    public class DocumentsInfo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int DocType { get; set; }
        [Required]
        [StringLength(250)]
        public string DocName { get; set; }
        [Required]
        public string DocPath { get; set; }
        public Guid DocSourceId { get; set; }
        [Required]
        [StringLength(50)]
        public string SourceFolder { get; set; }    

    }
}
