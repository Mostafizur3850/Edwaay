using ECommerce.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
 
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(object id, CancellationToken ct = default)
        => await _dbSet.FindAsync(new[] { id }, ct);

    public async Task<List<T>> GetAllAsync(CancellationToken ct = default)
        => await _dbSet.AsNoTracking().ToListAsync(ct);

    public async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
        => await _dbSet.AsNoTracking().Where(predicate).ToListAsync(ct);

    public async Task AddAsync(T entity, CancellationToken ct = default)
        => await _dbSet.AddAsync(entity, ct);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Remove(T entity) => _dbSet.Remove(entity);

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => _context.SaveChangesAsync(ct);


    public void Delete(T entity) => _dbSet.Remove(entity);

    public async Task DeleteByIdAsync(object id, CancellationToken ct = default)
    {
        var entity = await GetByIdAsync(id, ct);
        if (entity != null) _dbSet.Remove(entity);
    }


    public async Task DeleteByIdAsyncNew(object id, CancellationToken ct = default)
    {
        var entity = await GetByIdAsync(id, ct);
        if (entity != null)
            _dbSet.Remove(entity);
    }

    public async Task DeleteById(int id, CancellationToken ct = default)
    {
        var entity = await _dbSet.FindAsync(new object[] { id }, ct);

        if (entity != null)
            _dbSet.Remove(entity);
    }

    public async Task<int> DeleteAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
    {   
        return await _dbSet.Where(predicate).ExecuteDeleteAsync(ct);
    }

    public IQueryable<T> All => _dbSet.AsQueryable();

    public IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
    => _dbSet.Where(predicate);
    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct)
    {
        return await _dbSet.AnyAsync(predicate, ct);
    }

    public async Task<T?> GetAsync( Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? include = null,  CancellationToken ct = default)
    {
        IQueryable<T> query = _dbSet;  if (include != null)
            query = include(query);

        return await query.FirstOrDefaultAsync(predicate, ct);
    }

     


}
