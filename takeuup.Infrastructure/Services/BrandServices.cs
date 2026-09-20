using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public sealed class BrandQueryService : IBrandQueryService
{
    private readonly AppDbContext _db;
    public BrandQueryService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<IdNameDto>> GetAllAsync(CancellationToken ct)
    {
        return await _db.Brands.AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new IdNameDto(x.Id.ToString(), x.Name))
            .ToListAsync(ct);
    }
}

public sealed class BrandAdminService : IBrandAdminService
{
    private readonly AppDbContext _db;
    public BrandAdminService(AppDbContext db) => _db = db;

    public async Task<IdNameDto> CreateAsync(string name, CancellationToken ct)
    {
        var b = new Brand { Name = name.Trim() };
        _db.Brands.Add(b);
        await _db.SaveChangesAsync(ct);
        return new IdNameDto(b.Id.ToString(), b.Name);
    }

    public async Task<IdNameDto?> UpdateAsync(string id, string name, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var bid)) return null;
        var b = await _db.Brands.FirstOrDefaultAsync(x => x.Id == bid, ct);
        if (b is null) return null;

        b.Name = name.Trim();
        await _db.SaveChangesAsync(ct);
        return new IdNameDto(b.Id.ToString(), b.Name);
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var bid)) return false;
        var b = await _db.Brands.FirstOrDefaultAsync(x => x.Id == bid, ct);
        if (b is null) return false;

        _db.Brands.Remove(b);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
