using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IPMetaKeywordService
    {
        void Add(ProductMetaKeyword model);
        void Update(ProductMetaKeyword model);
        Task SaveAsync(CancellationToken ct = default);

        IEnumerable<ProductMetaKeyword> GetAll();
        ProductMetaKeyword GetById(Guid id);

        Task DeleteByProductIdAsync(Guid productId, CancellationToken ct = default);
        Task Delete(Guid id);
        
    }
}
