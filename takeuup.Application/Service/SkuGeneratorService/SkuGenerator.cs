using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class SkuGenerator : ISkuGenerator
    {
        private readonly IBaseRepository<ProductVariant> _context;

        public SkuGenerator(IBaseRepository<ProductVariant> context)
        {
            _context = context;
        }

        public string Generate(Product product)
            {
                // Example: PRD-AB12-240125-8392
                return $"PRD-{product.CategoryId.ToString()[..4].ToUpper()}-{DateTime.UtcNow:yyMMdd}-{Random.Shared.Next(1000, 9999)}";
            }


        public async Task<bool> ExistsSkuAsync(string sku, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(sku))
                throw new ArgumentException("SKU cannot be null or empty", nameof(sku));

            return await _context.AnyAsync(v => v.Sku == sku, ct);
        }
    }

}
