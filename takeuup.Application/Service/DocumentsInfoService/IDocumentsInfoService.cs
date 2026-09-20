using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IDocumentsInfoService
    {
        void Add(DocumentsInfo model);
        void Update(DocumentsInfo model);
        Task SaveAsync(CancellationToken ct = default);

        IEnumerable<DocumentsInfo> GetAll();
        DocumentsInfo GetById(int id);

        
        Task Delete(int id);
        Task<List<DocumentsInfo>> GetByDocTypeAndSourceAsync(
    int docType,
    Guid docSourceId,
    CancellationToken ct = default);
    }
}
