using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IBrandService
    {
        void AddBrand(Brand menu);
        Task<Brand?> GetByIdAsync(Guid id, CancellationToken ct = default);


        IEnumerable<Brand> GetAll();
        Task<IReadOnlyList<BrandListDto>> GetAllBrandAsync(CancellationToken ct = default);
        void Update(Brand  menu);
        //Task Delete(Guid id);
    
        void Delete(Guid id);
        Task SaveAsync(CancellationToken ct = default);
        bool Save();

        Task<bool> AnyAsync(Expression<Func<Brand, bool>> predicate, CancellationToken ct);


    }
}
