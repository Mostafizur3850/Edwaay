using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICMetaKeywordService
    {
        void Add(CategoryMetaKeyword model);
        void Update(CategoryMetaKeyword model);
        Task SaveAsync(CancellationToken ct = default);

        IEnumerable<CategoryMetaKeyword> GetAll();
        CategoryMetaKeyword GetById(Guid id);

        
        Task Delete(Guid id);
        
    }
}
