using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using MediatR;

namespace ECommerce.Application.Common
{
    // Category Commands
    public record CreateCategoryCommand(string Name, Guid? ParentId) : IRequest<Category>;
    public record UpdateCategoryCommand(Guid Id, string Name, Guid? ParentId) : IRequest<Category?>;
    public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;

    // Brand Commands
    public record CreateBrandCommand(string Name) : IRequest<Brand>;
    public record UpdateBrandCommand(Guid Id, string Name) : IRequest<Brand?>;
    public record DeleteBrandCommand(Guid Id) : IRequest<bool>;

    // Product Commands
    public record CreateProductCommand(string Name, string Description, Guid CategoryId, Guid? BrandId, string Currency, bool IsPublished) : IRequest<Product>;
    public record UpdateProductCommand(Guid Id, string Name, string Description, Guid CategoryId, Guid? BrandId, string Currency, bool IsPublished) : IRequest<Product?>;
    public record PublishProductCommand(Guid Id, bool IsPublished) : IRequest<Product?>;
    public record DeleteProductCommand(Guid Id) : IRequest<bool>;

    // Handlers
    public class AdminCQRSHandlers :
        IRequestHandler<CreateCategoryCommand, Category>,
        IRequestHandler<UpdateCategoryCommand, Category?>,
        IRequestHandler<DeleteCategoryCommand, bool>,
        
        IRequestHandler<CreateBrandCommand, Brand>,
        IRequestHandler<UpdateBrandCommand, Brand?>,
        IRequestHandler<DeleteBrandCommand, bool>,

        IRequestHandler<CreateProductCommand, Product>,
        IRequestHandler<UpdateProductCommand, Product?>,
        IRequestHandler<PublishProductCommand, Product?>,
        IRequestHandler<DeleteProductCommand, bool>
    {
        private readonly IBaseRepository<Category> _categoryRepository;
        private readonly IBaseRepository<Brand> _brandRepository;
        private readonly IBaseRepository<Product> _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AdminCQRSHandlers(
            IBaseRepository<Category> categoryRepository,
            IBaseRepository<Brand> brandRepository,
            IBaseRepository<Product> productRepository,
            IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _brandRepository = brandRepository;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }

        // Category Handlers
        public async Task<Category> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var cat = new Category { Id = Guid.NewGuid(), Name = request.Name, ParentId = request.ParentId };
            await _categoryRepository.AddAsync(cat, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
            return cat;
        }

        public async Task<Category?> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var cat = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
            if (cat == null) return null;
            cat.Name = request.Name.Trim();
            cat.ParentId = request.ParentId;
            _categoryRepository.Update(cat);
            await _unitOfWork.CommitAsync(cancellationToken);
            return cat;
        }

        public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var cat = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
            if (cat == null) return false;
            _categoryRepository.Remove(cat);
            await _unitOfWork.CommitAsync(cancellationToken);
            return true;
        }

        // Brand Handlers
        public async Task<Brand> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
        {
            var b = new Brand { Id = Guid.NewGuid(), Name = request.Name };
            await _brandRepository.AddAsync(b, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
            return b;
        }

        public async Task<Brand?> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
        {
            var b = await _brandRepository.GetByIdAsync(request.Id, cancellationToken);
            if (b == null) return null;
            b.Name = request.Name;
            _brandRepository.Update(b);
            await _unitOfWork.CommitAsync(cancellationToken);
            return b;
        }

        public async Task<bool> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
        {
            var b = await _brandRepository.GetByIdAsync(request.Id, cancellationToken);
            if (b == null) return false;
            _brandRepository.Remove(b);
            await _unitOfWork.CommitAsync(cancellationToken);
            return true;
        }

        // Product Handlers
        public async Task<Product> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var slug = request.Name.Trim().ToLower().Replace(" ", "-");
            var p = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Slug = slug,
                Description = request.Description,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId,
                Currency = request.Currency,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _productRepository.AddAsync(p, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
            return p;
        }

        public async Task<Product?> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var p = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (p == null) return null;
            p.Name = request.Name.Trim();
            p.Description = request.Description;
            p.CategoryId = request.CategoryId;
            p.BrandId = request.BrandId;
            p.Currency = request.Currency;
            p.IsPublished = request.IsPublished;
            p.UpdatedAt = DateTime.UtcNow;
            _productRepository.Update(p);
            await _unitOfWork.CommitAsync(cancellationToken);
            return p;
        }

        public async Task<Product?> Handle(PublishProductCommand request, CancellationToken cancellationToken)
        {
            var p = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (p == null) return null;
            p.IsPublished = request.IsPublished;
            p.UpdatedAt = DateTime.UtcNow;
            _productRepository.Update(p);
            await _unitOfWork.CommitAsync(cancellationToken);
            return p;
        }

        public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var p = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (p == null) return false;
            _productRepository.Remove(p);
            await _unitOfWork.CommitAsync(cancellationToken);
            return true;
        }
    }
}
