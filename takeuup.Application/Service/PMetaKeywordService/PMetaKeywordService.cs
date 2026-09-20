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
    public class PMetaKeywordService : IPMetaKeywordService
    {
        private readonly IBaseRepository<ProductMetaKeyword> _productMetakeyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PMetaKeywordService(IBaseRepository<ProductMetaKeyword> productMetakeyRepository, IUnitOfWork unitOfWork)
        {
            _productMetakeyRepository = productMetakeyRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(ProductMetaKeyword model)
        {
            _productMetakeyRepository.AddAsync(model);
        }

        public async Task Delete(Guid id)
        {
            await _productMetakeyRepository.DeleteByIdAsync((ProductMetaKeyword d) => d.Id == id);
        }



        public IEnumerable<ProductMetaKeyword> GetAll()
        {
            return _productMetakeyRepository.All;
        }


        public ProductMetaKeyword GetById(Guid id)
        {
            return _productMetakeyRepository.FindBy(d => d.Id == id).FirstOrDefault();
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public void Update(ProductMetaKeyword model)
        {
            _productMetakeyRepository.Update(model);
        }

        public async Task DeleteByProductIdAsync(   Guid productId,
       CancellationToken ct = default)
        {
            await _productMetakeyRepository.DeleteAsync(
                x => x.ProductId == productId,
                ct
            );
        }
    }
}
