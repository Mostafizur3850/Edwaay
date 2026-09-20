using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ISkuGenerator
    {
 
         string Generate(Product product);
        Task<bool> ExistsSkuAsync(string sku, CancellationToken ct);
    }
}
