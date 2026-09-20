using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Repository
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync(CancellationToken ct = default);
        //Task<int> CommitAsync();
        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
    }
}
