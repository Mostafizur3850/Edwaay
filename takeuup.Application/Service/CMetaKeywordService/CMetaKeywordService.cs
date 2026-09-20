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
    public class CMetaKeywordService : ICMetaKeywordService
    {
        private readonly IBaseRepository<CategoryMetaKeyword> _cMetaKeyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CMetaKeywordService(IBaseRepository<CategoryMetaKeyword> cMetaKeyRepository, IUnitOfWork unitOfWork)
        {
            _cMetaKeyRepository = cMetaKeyRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(CategoryMetaKeyword model)
        {
            _cMetaKeyRepository.AddAsync(model);
        }

        public async Task Delete(Guid id)
        {
            await _cMetaKeyRepository.DeleteByIdAsync((CategoryMetaKeyword d) => d.Id == id);
        }



        public IEnumerable<CategoryMetaKeyword> GetAll()
        {
            return _cMetaKeyRepository.All;
        }


        public CategoryMetaKeyword GetById(Guid id)
        {
            return _cMetaKeyRepository.FindBy(d => d.Id == id).FirstOrDefault();
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public void Update(CategoryMetaKeyword model)
        {
            _cMetaKeyRepository.Update(model);
        }
    }
}
