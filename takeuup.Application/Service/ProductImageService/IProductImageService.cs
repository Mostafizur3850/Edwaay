using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IProductImageService
    {
        void Add(ProductImage model);
        void Update(ProductImage model);
        Task SaveAsync(CancellationToken ct = default);

        IEnumerable<ProductImage> GetAll();
        IQueryable<ProductImage> GetAllIQueryable();
        ProductImage GetById(Guid id);        
        Task Delete(Guid id);

        Task DeleteNew(Guid id);


    }
}
