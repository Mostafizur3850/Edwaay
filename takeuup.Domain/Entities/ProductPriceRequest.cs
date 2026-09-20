using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Domain.Entities
{
    [Table("ProductPriceRequests", Schema = "dbo")]
    public class ProductPriceRequest : BaseEntity
    {
        [Required]
        public Guid ProductId { get; set; }
        public Guid? UserId { get; set; }
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public decimal? QuotedPrice { get; set; }
        
        public string Status { get; set; } = "Pending"; // Pending, Quoted, Rejected

        public string? GuestName { get; set; }
        public string? GuestPhone { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestAddress { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
