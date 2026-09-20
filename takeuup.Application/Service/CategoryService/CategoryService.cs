using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.CategoryDto;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Hosting;


namespace ECommerce.Application.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly IBaseRepository<Category> _categoryRepository;
        private readonly IBaseRepository<CategoryMetaKeyword> _catmetaKeywordRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDocumentsInfoService _documentsInfoService;
        private readonly ICMetaKeywordService _cMetaKeywordService;
        public CategoryService(IBaseRepository<Category> categoryRepository, IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IDocumentsInfoService documentsInfoService, IBaseRepository<CategoryMetaKeyword> catmetaKeywordRepository, ICMetaKeywordService cMetaKeywordService)
        {
            _categoryRepository = categoryRepository;        
            _unitOfWork = unitOfWork;  
            _fileStorageService = fileStorageService;
            _documentsInfoService = documentsInfoService;
            _catmetaKeywordRepository = catmetaKeywordRepository;
            _cMetaKeywordService = cMetaKeywordService;
        }


        #region new parttern want to follow 

        public async Task<List<CategoryListDto>> GetAllAsync()
        {
            var result = await (
                from ca in _categoryRepository.All
                join cm in _catmetaKeywordRepository.All
                    on ca.Id equals cm.CategoryId into keywordGroup
                select new CategoryListDto
                {
                    Id = ca.Id,
                    Name = ca.Name,
                    Slug = ca.Slug,
                    IconUrl = ca.IconUrl,
                    IsHighlight = ca.IsHighlight,
                    IsActive = ca.IsActive,
                    Serial = ca.Serial,
                    ParentCategoryId = ca.ParentId,
                    MetaKeywords = keywordGroup.Select(x => x.Keyword)
                        .ToList()
                }
            ).ToListAsync();

            return result;
        }



        public async Task CreateAsync(CategoryCreateUpdateDto dto, CancellationToken ct)
        {
            // ---------- SLUG ----------
            var baseSlug = SlugHelper.Generate(dto.Name);
            var slug = baseSlug;
            var i = 1;

            while (await _categoryRepository.AnyAsync(x => x.Slug == slug, ct))
            {
                slug = $"{baseSlug}-{i++}";
            }

      
            Guid? parentId = null;

            if (dto.ParentCategoryId.HasValue &&
                dto.ParentCategoryId.Value != Guid.Empty)
            {
                var parentExists = await _categoryRepository
                    .AnyAsync(x => x.Id == dto.ParentCategoryId.Value, ct);

                if (!parentExists)
                    throw new Exception("Invalid Parent Category");

                parentId = dto.ParentCategoryId.Value;
            }

            var category = new Category
            {
                Name = dto.Name,
                Slug = slug,
                IsHighlight = dto.IsHighlight,
                IsActive = dto.IsActive,
                Serial = dto.Serial,
                ParentId = parentId,
                IconUrl = null
            };

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync(ct);


            // ---------- META KEYWORDS ----------
            if (dto.MetaKeywords != null && dto.MetaKeywords.Any())
            {
                foreach (var keyword in dto.MetaKeywords.Distinct())
                {
                    _cMetaKeywordService.Add(new CategoryMetaKeyword
                    {
                        CategoryId = category.Id,
                        Keyword = keyword.Trim(),                        
                    });       
                }

                await _cMetaKeywordService.SaveAsync(ct); 
            }


            // ---------- ICON UPLOAD ----------
            if (dto.Icon == null || dto.Icon.Count == 0)
                return;

            var uploadedDocs = await _fileStorageService.UploadImageAsync(dto.Icon,"Category", category.Id, "category_", ct);
            var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;

            foreach (var doc in uploadedDocs)
            {
                _documentsInfoService.Add(new DocumentsInfo
                {
                    DocName = doc.DocName,
                    DocPath = doc.DocPath,
                    DocType = (int)EnumDocType.Category,
                    DocSourceId = category.Id,
                    SourceFolder = category.Id.ToString()
                });
            }

            await _documentsInfoService.SaveAsync(ct);
            // ---------- UPDATE CATEGORY ----------
            category.IconUrl = lastIconPath;
            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync(ct);
        }


        public async Task UpdateAsync(Guid id, CategoryCreateUpdateDto dto, CancellationToken ct)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync(ct);

            try
            {
                // ---------- LOAD CATEGORY WITH META KEYWORDS ----------
                var category = await GetByIdWithKeywordsAsync(id, ct);

                if (category == null)
                    throw new Exception("Category not found");

                // ---------- SLUG (IF NAME CHANGED) ----------
                if (!string.Equals(category.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
                {
                    var baseSlug = SlugHelper.Generate(dto.Name);
                    var slug = baseSlug;
                    var i = 1;

                    while (await _categoryRepository.AnyAsync(
                        x => x.Slug == slug && x.Id != id, ct))
                    {
                        slug = $"{baseSlug}-{i++}";
                    }

                    category.Slug = slug;
                }

                // ---------- PARENT VALIDATION ----------
                if (dto.ParentCategoryId.HasValue && dto.ParentCategoryId != Guid.Empty)
                {
                    var parentExists = await _categoryRepository
                        .AnyAsync(x => x.Id == dto.ParentCategoryId.Value, ct);

                    if (!parentExists)
                        throw new Exception("Invalid Parent Category");

                    category.ParentId = dto.ParentCategoryId;
                }
                else
                {
                    category.ParentId = null;
                }

                // ---------- BASIC FIELDS ----------
                category.Name = dto.Name;
                category.IsHighlight = dto.IsHighlight;
                category.IsActive = dto.IsActive;
                category.Serial = dto.Serial;

                // ---------- META KEYWORDS SYNC ----------
                category.MetaKeywords ??= new List<CategoryMetaKeyword>();

                var existingKeywords = category.MetaKeywords
                    .Select(x => x.Keyword)
                    .ToList();

                var newKeywords = dto.MetaKeywords?
                    .Select(x => x.Trim())
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList() ?? new List<string>();

                // REMOVE DELETED
                var toRemove = category.MetaKeywords
                    .Where(x => !newKeywords
                        .Any(k => k.Equals(x.Keyword, StringComparison.OrdinalIgnoreCase)))
                    .ToList();

                foreach (var item in toRemove)
                {
                    category.MetaKeywords.Remove(item);
                }

                // ADD NEW
                var toAdd = newKeywords
                    .Where(k => !existingKeywords
                        .Any(e => e.Equals(k, StringComparison.OrdinalIgnoreCase)))
                    .ToList();

                foreach (var keyword in toAdd)
                {                    
                        _cMetaKeywordService.Add(new CategoryMetaKeyword
                        {
                            CategoryId = category.Id,
                            Keyword = keyword.Trim(),
                        });                  

                }
                await _cMetaKeywordService.SaveAsync(ct);

                // ---------- ICON UPDATE ----------
                if (dto.Icon != null && dto.Icon.Count > 0)
                {
                    await _fileStorageService.DeletePrevFilesAsync(
                        EnumDocType.Category,
                        "Category",
                        category.Id,
                        ct
                    );

                    var uploadedDocs = await _fileStorageService.UploadImageAsync(
                        dto.Icon,
                        "Category",
                        category.Id,
                        "category_",
                        ct
                    );

                    var lastIconPath = uploadedDocs.LastOrDefault()?.DocPath;

                    foreach (var doc in uploadedDocs)
                    {
                        _documentsInfoService.Add(new DocumentsInfo
                        {
                            DocName = doc.DocName,
                            DocPath = doc.DocPath,
                            DocType = (int)EnumDocType.Category,
                            DocSourceId = category.Id,
                            SourceFolder = category.Id.ToString()
                        });
                    }

                    await _documentsInfoService.SaveAsync(ct);
                    category.IconUrl = lastIconPath;
                }

                // ---------- SAVE ----------
                _categoryRepository.Update(category);
                await _unitOfWork.CommitAsync(ct);
                await transaction.CommitAsync(ct);
            }
            catch
            {
                await transaction.RollbackAsync(ct);
                throw;
            }
        }




        public async Task DeleteAsync(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return;


            _categoryRepository.Delete(category);
            await _categoryRepository.SaveChangesAsync();
        }

        public async Task ToggleStatusAsync(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return;

            category.IsActive = !category.IsActive;
            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();
        }


        public async Task<Category?> GetByIdWithKeywordsAsync(Guid id, CancellationToken ct)
        {
            return await _categoryRepository.GetAsync(
                x => x.Id == id,
                q => q.Include(x => x.MetaKeywords),
                ct
            );
        }



        #endregion




    }
}

