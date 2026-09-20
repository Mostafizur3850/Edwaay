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
    public class ProductTagService : IProductTagService
    {
        private readonly IBaseRepository<ProductTag> _productTagRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProductTagService(IBaseRepository<ProductTag> productTagRepository, IUnitOfWork unitOfWork)
        {
            _productTagRepository = productTagRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(ProductTag model)
        {
            _productTagRepository.AddAsync(model);
        }

        public async Task Delete(Guid id)
        {
            await _productTagRepository.DeleteByIdAsync((ProductMetaKeyword d) => d.Id == id);
        }



        public IEnumerable<ProductTag> GetAll()
        {
            return _productTagRepository.All;
        }


        public ProductTag GetById(Guid id)
        {
            return _productTagRepository.FindBy(d => d.Id == id).FirstOrDefault();
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public void Update(ProductTag model)
        {
            _productTagRepository.Update(model);
        }

        public async Task DeleteByProductIdAsync(   Guid productId,
       CancellationToken ct = default)
        {
            await _productTagRepository.DeleteAsync(
                x => x.ProductId == productId,
                ct
            );
        }
    }
}
