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
    public class ProductImageService : IProductImageService
    {
        private readonly IBaseRepository<ProductImage> _productImageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProductImageService(IBaseRepository<ProductImage> productImageRepository, IUnitOfWork unitOfWork)
        {
            _productImageRepository = productImageRepository;
            _unitOfWork = unitOfWork;
        }

        public void Add(ProductImage model)
        {
            _productImageRepository.AddAsync(model);
        }

        public async Task Delete(Guid id)
        {
            await _productImageRepository.DeleteByIdAsync((ProductImage d) => d.Id == id);
        }


        public async Task DeleteNew(Guid id)
        {
            await _productImageRepository.DeleteByIdAsyncNew(id);
        }
        public IEnumerable<ProductImage> GetAll()
        {
            return _productImageRepository.All;
        }


        public IQueryable<ProductImage> GetAllIQueryable()
        {
            return _productImageRepository.All;
        }

        public ProductImage GetById(Guid id)
        {
            return _productImageRepository.FindBy(d => d.Id == id).FirstOrDefault();
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public void Update(ProductImage model)
        {
            _productImageRepository.Update(model);
        }
    }
}
