using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Service
{
    public interface IPageService
    {
        void AddPage(Page page);
        Task<Page?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<IReadOnlyList<Page>> GetAllPagesAsync(CancellationToken ct = default);
        void Update(Page page);
        void Delete(Guid id);
        Task SaveAsync(CancellationToken ct = default);
        Task<bool> AnyAsync(Expression<Func<Page, bool>> predicate, CancellationToken ct);
    }
}
