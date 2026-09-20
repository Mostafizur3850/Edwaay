using ECommerce.Domain.Entities;
using System.Linq.Expressions;

public interface IBaseRepository<T> where T : class
{
    Task<T?> GetByIdAsync(object id, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    IQueryable<T> All { get; }

    IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
    void Delete(T entity);
    Task<int> DeleteAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task DeleteByIdAsync(object id, CancellationToken ct = default);
    Task DeleteByIdAsyncNew(object id, CancellationToken ct = default);
    Task DeleteById(int id, CancellationToken ct = default); 

    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct);


    Task<T?> GetAsync( Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? include = null,  CancellationToken ct = default);

    

}
