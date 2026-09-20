using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Repository;
using MediatR;

namespace ECommerce.Application.Common
{
    // Queries
    public record GetListQuery<TEntity>(Expression<Func<TEntity, bool>>? Predicate = null) : IRequest<List<TEntity>> where TEntity : class;
    
    public record GetByIdQuery<TEntity>(object Id) : IRequest<TEntity?> where TEntity : class;

    // Commands
    public record CreateEntityCommand<TEntity>(TEntity Entity) : IRequest<TEntity> where TEntity : class;

    public record UpdateEntityCommand<TEntity>(TEntity Entity) : IRequest<TEntity> where TEntity : class;

    public record DeleteEntityCommand<TEntity>(object Id) : IRequest<bool> where TEntity : class;

    // Handlers
    public class GenericQueryHandlers<TEntity> : 
        IRequestHandler<GetListQuery<TEntity>, List<TEntity>>,
        IRequestHandler<GetByIdQuery<TEntity>, TEntity?>
        where TEntity : class
    {
        private readonly IBaseRepository<TEntity> _repository;

        public GenericQueryHandlers(IBaseRepository<TEntity> repository)
        {
            _repository = repository;
        }

        public async Task<List<TEntity>> Handle(GetListQuery<TEntity> request, CancellationToken cancellationToken)
        {
            if (request.Predicate != null)
            {
                return await _repository.FindAsync(request.Predicate, cancellationToken);
            }
            return await _repository.GetAllAsync(cancellationToken);
        }

        public async Task<TEntity?> Handle(GetByIdQuery<TEntity> request, CancellationToken cancellationToken)
        {
            return await _repository.GetByIdAsync(request.Id, cancellationToken);
        }
    }

    public class GenericCommandHandlers<TEntity> :
        IRequestHandler<CreateEntityCommand<TEntity>, TEntity>,
        IRequestHandler<UpdateEntityCommand<TEntity>, TEntity>,
        IRequestHandler<DeleteEntityCommand<TEntity>, bool>
        where TEntity : class
    {
        private readonly IBaseRepository<TEntity> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public GenericCommandHandlers(IBaseRepository<TEntity> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<TEntity> Handle(CreateEntityCommand<TEntity> request, CancellationToken cancellationToken)
        {
            await _repository.AddAsync(request.Entity, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
            return request.Entity;
        }

        public async Task<TEntity> Handle(UpdateEntityCommand<TEntity> request, CancellationToken cancellationToken)
        {
            _repository.Update(request.Entity);
            await _unitOfWork.CommitAsync(cancellationToken);
            return request.Entity;
        }

        public async Task<bool> Handle(DeleteEntityCommand<TEntity> request, CancellationToken cancellationToken)
        {
            var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (entity == null) return false;

            _repository.Remove(entity);
            await _unitOfWork.CommitAsync(cancellationToken);
            return true;
        }
    }
}
