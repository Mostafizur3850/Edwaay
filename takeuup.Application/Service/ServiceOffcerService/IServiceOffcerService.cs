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
    public interface IServiceOffcerService
    {
        void Add(ServiceOffer model);
        Task<ServiceOffer?> GetByIdAsync(Guid id, CancellationToken ct = default);


        IEnumerable<ServiceOffer> GetAll();
        Task<IReadOnlyList<OfferServiceList>> GetAllAsync(CancellationToken ct = default);
        void Update(ServiceOffer menu);
        //Task Delete(Guid id);
    
        void Delete(Guid id);
        Task SaveAsync(CancellationToken ct = default);
        bool Save();

        Task<bool> AnyAsync(Expression<Func<ServiceOffer, bool>> predicate, CancellationToken ct);


    }
}
