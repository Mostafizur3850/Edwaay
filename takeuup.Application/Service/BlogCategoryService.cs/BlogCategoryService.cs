using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;

public class BlogCategoryService : IBlogCategoryService
{
    private readonly IBaseRepository<BlogCategory> _repo;
    private readonly IFileStorageService _fileStorageService;
    private readonly IDocumentsInfoService _documentsInfoService;
    private readonly IUnitOfWork _unitOfWork;

    public BlogCategoryService(
        IBaseRepository<BlogCategory> repo,
        IFileStorageService fileStorageService,
        IDocumentsInfoService documentsInfoService,
        IUnitOfWork unitOfWork)
    {
        _repo = repo;
        _fileStorageService = fileStorageService;
        _documentsInfoService = documentsInfoService;
        _unitOfWork = unitOfWork;
    }

    // 🔓 LIST
    public async Task<List<BlogCategoryListDto>> GetAllAsync()
    {
        return await _repo.All
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new BlogCategoryListDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                IsActive = x.IsActive,
                ImageUrl = x.ImageUrl
            })
            .ToListAsync();
    }

    // 🔒 CREATE (with image)
    public async Task CreateAsync(BlogCategoryCreateDto dto, CancellationToken ct)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync(ct);

        try
        {
            // ---------- SLUG ----------
            var baseSlug = SlugHelper.Generate(dto.Name);
            var slug = baseSlug;
            var i = 1;

            while (await _repo.AnyAsync(x => x.Slug == slug, ct))
                slug = $"{baseSlug}-{i++}";

            // ---------- CATEGORY ----------
            var category = new BlogCategory
            {
                Name = dto.Name,
                Slug = slug,
                IsActive = true,
                ImageUrl = ""
            };

            await _repo.AddAsync(category);
            await _repo.SaveChangesAsync(ct);

            // ---------- IMAGE UPLOAD ----------
            if (dto.Image != null && dto.Image.Count > 0)
            {
                var uploadedDocs = await _fileStorageService.UploadImageAsync(
                    dto.Image,
                    "BlogCategory",
                    category.Id,
                    "category_",
                    ct
                );

                var lastImagePath = uploadedDocs.LastOrDefault()?.DocPath;

                foreach (var doc in uploadedDocs)
                {
                    _documentsInfoService.Add(new DocumentsInfo
                    {
                        DocName = doc.DocName,
                        DocPath = doc.DocPath,
                        DocType = (int)EnumDocType.BlogCategory,
                        DocSourceId = category.Id,
                        SourceFolder = category.Id.ToString()
                    });
                }

                await _documentsInfoService.SaveAsync(ct);

                category.ImageUrl = lastImagePath;
                _repo.Update(category);
                await _repo.SaveChangesAsync(ct);
            }

            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    // 🔒 TOGGLE STATUS
    public async Task ToggleStatusAsync(Guid id, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(id);
        if (category == null) return;

        category.IsActive = !category.IsActive;
        _repo.Update(category);
        await _repo.SaveChangesAsync(ct);
    }

    // 🔒 DELETE
    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(id);
        if (category == null) return;

        // delete images
        await _fileStorageService.DeletePrevFilesAsync(
            EnumDocType.BlogCategory,
            "BlogCategory",
            category.Id,
            ct
        );

        _repo.Delete(category);
        await _repo.SaveChangesAsync(ct);
    }

    // 🔒 GET BY ID (for edit)
    public async Task<BlogCategoryDetailsDto> GetByIdAsync(Guid id)
    {
        var category = await _repo.GetByIdAsync(id);

        if (category == null)
            throw new Exception("Category not found");

        return new BlogCategoryDetailsDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            IsActive = category.IsActive,
            ImageUrl = category.ImageUrl
        };
    }



    public async Task UpdateAsync(Guid id, BlogCategoryCreateDto dto, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(id);
        if (category == null)
            throw new Exception("Category not found");

        category.Name = dto.Name;

        // regenerate slug if name changed
        var baseSlug = SlugHelper.Generate(dto.Name);
        var slug = baseSlug;
        var i = 1;

        while (await _repo.AnyAsync(x => x.Slug == slug && x.Id != id, ct))
            slug = $"{baseSlug}-{i++}";

        category.Slug = slug;

        _repo.Update(category);
        await _repo.SaveChangesAsync(ct);
    }

}
