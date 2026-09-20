using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;

public class BlogService : IBlogService
{
    private readonly IBaseRepository<Blog> _blogRepo;
    private readonly IBaseRepository<BlogTag> _tagRepo;
    private readonly IBaseRepository<BlogMetaKeyword> _metaRepo;
    private readonly IFileStorageService _fileStorageService;
    private readonly IDocumentsInfoService _documentsInfoService;
    private readonly IUnitOfWork _unitOfWork;

    public BlogService(
        IBaseRepository<Blog> blogRepo,
        IBaseRepository<BlogTag> tagRepo,
        IBaseRepository<BlogMetaKeyword> metaRepo,
        IFileStorageService fileStorageService,
        IDocumentsInfoService documentsInfoService,
        IUnitOfWork unitOfWork)
    {
        _blogRepo = blogRepo;
        _tagRepo = tagRepo;
        _metaRepo = metaRepo;
        _fileStorageService = fileStorageService;
        _documentsInfoService = documentsInfoService;
        _unitOfWork = unitOfWork;
    }

    // 🔓 PUBLIC LIST
    public async Task<List<BlogListDto>> GetAllAsync()
    {
        return await _blogRepo.All
            .Include(x => x.BlogCategory)
          .Select(x => new BlogListDto
          {
              Id = x.Id,
              Title = x.Title,
              ImageUrl = x.ImageUrl,
              BlogCategoryId = x.BlogCategoryId,
              CategoryName = x.BlogCategory.Name,
              Slug = x.Slug   // ✅ ADD THIS
          })
            .ToListAsync();
    }

    // 🔒 CREATE
    public async Task CreateAsync(BlogCreateUpdateDto dto, CancellationToken ct)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync(ct);

        try
        {
            // ---------- SLUG ----------
            var baseSlug = SlugHelper.Generate(dto.Title);
            var slug = baseSlug;
            var i = 1;

            while (await _blogRepo.AnyAsync(x => x.Slug == slug, ct))
                slug = $"{baseSlug}-{i++}";

            // ---------- BLOG ----------
            var blog = new Blog
            {
                Title = dto.Title,
                Slug = slug,
                BlogCategoryId = dto.BlogCategoryId,
                Description = dto.Description,
                MetaDescription = dto.MetaDescription,
                IsActive = dto.IsActive,
                ImageUrl = ""
            };

            await _blogRepo.AddAsync(blog);
            await _blogRepo.SaveChangesAsync(ct);

            // ---------- TAGS ----------
            if (dto.Tags?.Any() == true)
            {
                foreach (var tag in dto.Tags
                             .Select(x => x.Trim())
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Distinct(StringComparer.OrdinalIgnoreCase))
                {
                  await  _tagRepo.AddAsync(new BlogTag
                    {
                        BlogId = blog.Id,
                        Name = tag.ToLower()
                    });
                }
            }

            // ---------- META KEYWORDS ----------
            if (dto.MetaKeywords?.Any() == true)
            {
                foreach (var keyword in dto.MetaKeywords
                             .Select(x => x.Trim())
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Distinct(StringComparer.OrdinalIgnoreCase))
                {
                   await _metaRepo.AddAsync(new BlogMetaKeyword
                    {
                        BlogId = blog.Id,
                        Keyword = keyword.ToLower()
                    });
                }
            }

            await _unitOfWork.CommitAsync(ct);

            // ---------- IMAGE UPLOAD ----------
            if (dto.Image != null && dto.Image.Count > 0)
            {
                var uploadedDocs = await _fileStorageService.UploadImageAsync(
                    dto.Image,
                    "Blog",
                    blog.Id,
                    "blog_",
                    ct
                );

                var lastImagePath = uploadedDocs.LastOrDefault()?.DocPath;

                foreach (var doc in uploadedDocs)
                {
                    _documentsInfoService.Add(new DocumentsInfo
                    {
                        DocName = doc.DocName,
                        DocPath = doc.DocPath,
                        DocType = (int)EnumDocType.Blog,
                        DocSourceId = blog.Id,
                        SourceFolder = blog.Id.ToString()
                    });
                }

                await _documentsInfoService.SaveAsync(ct);

                blog.ImageUrl = lastImagePath;
                _blogRepo.Update(blog);
                await _blogRepo.SaveChangesAsync(ct);
            }

            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }

    }


    public async Task UpdateAsync(Guid id, BlogCreateUpdateDto dto, CancellationToken ct)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync(ct);

        try
        {
            var blog = await _blogRepo.GetAsync(
                x => x.Id == id,
                q => q.Include(x => x.BlogTags).Include(x => x.BlogMetaKeywords),
                ct
            );

            if (blog == null)
                throw new Exception("Blog not found");

            // ---------- BASIC FIELDS ----------
            if (!string.Equals(blog.Title, dto.Title, StringComparison.OrdinalIgnoreCase))
            {
                var baseSlug = SlugHelper.Generate(dto.Title);
                var slug = baseSlug;
                var i = 1;

                while (await _blogRepo.AnyAsync(x => x.Slug == slug && x.Id != id, ct))
                    slug = $"{baseSlug}-{i++}";

                blog.Slug = slug;
            }

            blog.Title = dto.Title;
            blog.BlogCategoryId = dto.BlogCategoryId;
            blog.Description = dto.Description;
            blog.MetaDescription = dto.MetaDescription;
            blog.IsActive = dto.IsActive;

            // ---------- TAGS SYNC ----------
          await  _tagRepo.DeleteByIdAsyncNew(blog.Id);
            if (dto.Tags?.Any() == true)
            {
                foreach (var tag in dto.Tags
                             .Select(x => x.Trim())
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Distinct(StringComparer.OrdinalIgnoreCase))
                {
                    await _tagRepo.AddAsync(new BlogTag
                    {
                        BlogId = blog.Id,
                        Name = tag.ToLower()
                    });
                }
            }

            // ---------- META KEYWORDS SYNC ----------
            await _metaRepo.DeleteByIdAsync(blog.Id);
            if (dto.MetaKeywords?.Any() == true)
            {
                foreach (var keyword in dto.MetaKeywords
                             .Select(x => x.Trim())
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Distinct(StringComparer.OrdinalIgnoreCase))
                {
                    await _metaRepo.AddAsync(new BlogMetaKeyword
                    {
                        BlogId = blog.Id,
                        Keyword = keyword.ToLower()
                    });
                }
            }

            await _unitOfWork.CommitAsync(ct);

            // ---------- IMAGE UPDATE ----------
            if (dto.Image != null && dto.Image.Count > 0)
            {
                await _fileStorageService.DeletePrevFilesAsync(
                    EnumDocType.Blog,
                    "Blog",
                    blog.Id,
                    ct
                );

                var uploadedDocs = await _fileStorageService.UploadImageAsync(
                    dto.Image,
                    "Blog",
                    blog.Id,
                    "blog_",
                    ct
                );

                var lastImagePath = uploadedDocs.LastOrDefault()?.DocPath;

                foreach (var doc in uploadedDocs)
                {
                    _documentsInfoService.Add(new DocumentsInfo
                    {
                        DocName = doc.DocName,
                        DocPath = doc.DocPath,
                        DocType = (int)EnumDocType.Blog,
                        DocSourceId = blog.Id,
                        SourceFolder = blog.Id.ToString()
                    });
                }

                await _documentsInfoService.SaveAsync(ct);

                blog.ImageUrl = lastImagePath;
                _blogRepo.Update(blog);
                await _blogRepo.SaveChangesAsync(ct);
            }

            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    // 🔒 DELETE
    public async Task DeleteAsync(Guid id)
    {
        var blog = await _blogRepo.GetByIdAsync(id);
        if (blog == null) return;

        _blogRepo.Delete(blog);
        await _blogRepo.SaveChangesAsync();
    }



    public async Task<BlogDetailsDto> GetByIdAsync(Guid id)
    {
        var blog = await _blogRepo.All
            .Include(x => x.BlogTags)
            .Include(x => x.BlogMetaKeywords)
            .FirstAsync(x => x.Id == id);

        return new BlogDetailsDto
        {
            Id = blog.Id,
            Title = blog.Title,
            BlogCategoryId = blog.BlogCategoryId,
            Description = blog.Description,
            MetaDescription = blog.MetaDescription,
            ImageUrl = blog.ImageUrl,
            Tags = blog.BlogTags.Select(x => x.Name).ToList(),
            MetaKeywords = blog.BlogMetaKeywords.Select(x => x.Keyword).ToList()
        };
    }



    public async Task<BlogDetailsDto> GetBySlugAsync(string slug)
    {
        var blog = await _blogRepo.All
            .Include(x => x.BlogTags)
            .Include(x => x.BlogMetaKeywords)
            .FirstOrDefaultAsync(x => x.Slug == slug);

        if (blog == null)
            throw new Exception("Blog not found");

        return new BlogDetailsDto
        {
            Id = blog.Id,
            Title = blog.Title,
            BlogCategoryId = blog.BlogCategoryId,
            Description = blog.Description,
            MetaDescription = blog.MetaDescription,
            ImageUrl = blog.ImageUrl,
            Tags = blog.BlogTags.Select(x => x.Name).ToList(),
            MetaKeywords = blog.BlogMetaKeywords.Select(x => x.Keyword).ToList()
        };
    }



    public async Task<List<BlogCategoryDto>> GetAllCategoriesAsync()
    {
        return await _blogRepo.All
            .Select(x => x.BlogCategory)
            .Distinct()
            .Where(x => x.IsActive)
            .Select(x => new BlogCategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }



    public async Task<List<BlogListDto>> GetByCategorySlugAsync(string slug)
    {
        return await _blogRepo.All
            .Include(x => x.BlogCategory)
            .Where(x => x.BlogCategory.Slug == slug)
            .Select(x => new BlogListDto
            {
                Id = x.Id,
                Title = x.Title,
                ImageUrl = x.ImageUrl,
                BlogCategoryId = x.BlogCategoryId,
                CategoryName = x.BlogCategory.Name,
                Slug = x.Slug
            })
            .ToListAsync();
    }
}
