using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductTagService
    {
        void Add(ProductTag model);
        void Update(ProductTag model);
        Task SaveAsync(CancellationToken ct = default);

        IEnumerable<ProductTag> GetAll();
        ProductTag GetById(Guid id);

        Task DeleteByProductIdAsync(Guid productId, CancellationToken ct = default);
        Task Delete(Guid id);
        
    }
}
