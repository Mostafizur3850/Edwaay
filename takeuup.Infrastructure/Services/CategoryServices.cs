using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Services;

public sealed class CategoryQueryService : ICategoryQueryService
{
    private readonly AppDbContext _db;
    public CategoryQueryService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<IdNameDto>> GetTreeAsync(CancellationToken ct)
    {
        var cats = await _db.Categories.AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new IdNameDto(x.Id.ToString(), x.Name))
            .ToListAsync(ct);

        return cats;
    }
}

public sealed class CategoryAdminService : ICategoryAdminService
{
    private readonly AppDbContext _db;
    public CategoryAdminService(AppDbContext db) => _db = db;

    public async Task<IdNameDto> CreateAsync(string name, string? parentId, CancellationToken ct)
    {
        Guid? pid = Guid.TryParse(parentId, out var g) ? g : null;

        var cat = new Category { Name = name.Trim(), ParentId = pid };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync(ct);
        return new IdNameDto(cat.Id.ToString(), cat.Name);
    }

    public async Task<IdNameDto?> UpdateAsync(string id, string name, string? parentId, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var cid)) return null;
        Guid? pid = Guid.TryParse(parentId, out var g) ? g : null;

        var cat = await _db.Categories.FirstOrDefaultAsync(x => x.Id == cid, ct);
        if (cat is null) return null;

        cat.Name = name.Trim();
        cat.ParentId = pid;
        await _db.SaveChangesAsync(ct);

        return new IdNameDto(cat.Id.ToString(), cat.Name);
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var cid)) return false;
        var cat = await _db.Categories.FirstOrDefaultAsync(x => x.Id == cid, ct);
        if (cat is null) return false;

        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
