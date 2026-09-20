using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public sealed class CartDto
    {
        public Guid Id { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
        public decimal Subtotal => Items.Sum(i => i.Price * i.Quantity);
    }


    public sealed class CartItemCreateDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }

        public Guid ProductVariantId { get; set; }
    }

    public sealed class UpdateCartQtyDto
    {
        public int Quantity { get; set; }
    }

    public sealed class MergeCartDto
    {
        public string SessionId { get; set; } = default!;
    }


    public class CartItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid ProductVariantId { get; set; }

        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
        public string Image { get; set; } = "";

        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
