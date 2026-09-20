using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public class DocumentsInfoService : IDocumentsInfoService
    {
        private readonly IBaseRepository<DocumentsInfo> _documentsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DocumentsInfoService(IBaseRepository<DocumentsInfo> documentsRepository, IUnitOfWork unitOfWork)
        {
            _documentsRepository = documentsRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(DocumentsInfo model)
        {
            _documentsRepository.AddAsync(model);
        }

        public async Task Delete(int id)
        {
            await _documentsRepository.DeleteById(id);
        }



        public IEnumerable<DocumentsInfo> GetAll()
        {
            return _documentsRepository.All;
        }

        public async Task<List<DocumentsInfo>> GetByDocTypeAndSourceAsync(
         int docType,
         Guid docSourceId,
         CancellationToken ct = default)
        {
            return await _documentsRepository
                .FindBy(d => d.DocType == docType && d.DocSourceId == docSourceId)
                .ToListAsync(ct);
        }

        public DocumentsInfo GetById(int id)
        {
            return _documentsRepository.FindBy(d => d.Id == id).FirstOrDefault();
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public void Update(DocumentsInfo model)
        {
            _documentsRepository.Update(model);
        }
    }
}
