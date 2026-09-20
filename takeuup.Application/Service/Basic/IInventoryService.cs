using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IInventoryService
    {
        Task<object> GetStockAsync(string productId, CancellationToken ct);
        Task<bool> AdjustStockAsync(string productId, string? variantId, int delta, string reason, CancellationToken ct);
    }
}
