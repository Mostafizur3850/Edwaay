using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
namespace ECommerce.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public sealed class BrandsController : ControllerBase
{
    private readonly IBrandService _brandService;
    private readonly IDocumentsInfoService _documentsInfoService;
    private readonly IWebHostEnvironment _env;
    private const string UploadPrefix = "brand_";
    private const string BrandFolder = "Content/photos/Brand";
    public BrandsController(
        IBrandService brandService,
        IDocumentsInfoService documentsInfoService,
        IWebHostEnvironment env)
    {
        _brandService = brandService;
        _documentsInfoService = documentsInfoService;
        _env = env;
    }
    // ---------------------------------------------------
    // GET ALL
    // ---------------------------------------------------
    [HttpGet("getAll")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var brands = await _brandService.GetAllBrandAsync(ct);
        return Ok(ApiResponses.Ok(brands, HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // CREATE
    // ---------------------------------------------------
    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> Create(
        [FromForm] CreateBrandDto dto,
        CancellationToken ct)
    {
        var baseSlug = SlugHelper.Generate(dto.Name);
        var slug = baseSlug;
        var i = 1;
        while (await _brandService.AnyAsync(x => x.Slug == slug, ct))
        {
            slug = $"{baseSlug}-{i++}";
        }
        var brand = new Brand
        {
            Name = dto.Name,
            Slug = slug,
            LogoUrl = null,
            IsActive = true
        };
        _brandService.AddBrand(brand);
        await _brandService.SaveAsync(ct);
        if (dto.Logo != null && dto.Logo.Count > 0)
        {
            var uploadedDocs = await UploadImageAsync(dto.Logo, brand.Id, ct);
            var lastDocPath = uploadedDocs.LastOrDefault()?.DocPath;
            foreach (var d in uploadedDocs)
            {
                _documentsInfoService.Add(new DocumentsInfo
                {
                    DocName = d.DocName,
                    DocPath = d.DocPath,
                    DocType = (int)EnumDocType.Brand,
                    DocSourceId = brand.Id,
                    SourceFolder = brand.Id.ToString()
                });
            }
            await _documentsInfoService.SaveAsync(ct);
            var dbBrand = await _brandService.GetByIdAsync(brand.Id, ct);
            if (dbBrand != null)
            {
                dbBrand.LogoUrl = lastDocPath;
                _brandService.Update(dbBrand);
                await _brandService.SaveAsync(ct);
            }
        }
        return Ok(ApiResponses.Ok("Brand created", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // TOGGLE STATUS
    // ---------------------------------------------------
    [HttpPatch("{id:guid}/status")]
    [Authorize]
    public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken ct)
    {
        var brand = await _brandService.GetByIdAsync(id, ct);
        if (brand == null)
            return NotFound("Brand not found");
        brand.IsActive = !brand.IsActive;
        await _brandService.SaveAsync(ct);
        return Ok(ApiResponses.Ok("Status updated", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // UPDATE
    // ---------------------------------------------------
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid id,
        [FromForm] UpdateBrandDto dto,
        CancellationToken ct)
    {
        var brand = await _brandService.GetByIdAsync(id, ct);
        if (brand == null)
            return NotFound("Brand not found");
        brand.Name = dto.Name;
        brand.Slug = dto.Slug;
        if (dto.Logo != null && dto.Logo.Count > 0)
        {
            await DeletePrevFilesAsync(id, ct);
            var uploadedDocs = await UploadImageAsync(dto.Logo, id, ct);
            brand.LogoUrl = uploadedDocs.LastOrDefault()?.DocPath;
        }
        await _brandService.SaveAsync(ct);
        return Ok(ApiResponses.Ok("Brand updated", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // HARD DELETE
    // ---------------------------------------------------
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> HardDelete(Guid id, CancellationToken ct)
    {
        var brand = await _brandService.GetByIdAsync(id, ct);
        if (brand == null)
            return NotFound("Brand not found");
        if (brand.Products.Any())
            return BadRequest("Cannot delete brand because products exist");
        await DeletePrevFilesAsync(id, ct);
        _brandService.Delete(id);
        await _brandService.SaveAsync(ct);
        return Ok(ApiResponses.Ok("Brand deleted permanently", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // FILE UPLOAD (ASYNC)
    // ---------------------------------------------------
    private async Task<List<VMDocInfoDTO>> UploadImageAsync(
        IFormFileCollection files,
        Guid brandId,
        CancellationToken ct)
    {
        var list = new List<VMDocInfoDTO>();
        var root = Path.Combine(_env.WebRootPath, "Content", "photos", "Brand", brandId.ToString());
        Directory.CreateDirectory(root);
        foreach (var file in files)
        {
            if (file.Length <= 0) continue;
            var safeName = CleanFileName(file.FileName);
            var savedName = $"{UploadPrefix}{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeName}";
            var fullPath = Path.Combine(root, savedName);
            await using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream, ct);
            list.Add(new VMDocInfoDTO
            {
                DocName = savedName,
                DocPath = $"Content/photos/Brand/{brandId}/{savedName}"
            });
        }
        return list;
    }
    // ---------------------------------------------------
    // DELETE FILES (ASYNC SAFE)
    // ---------------------------------------------------
    private async Task DeletePrevFilesAsync(Guid brandId, CancellationToken ct)
    {
        var docs = await _documentsInfoService
            .GetByDocTypeAndSourceAsync((int)EnumDocType.Brand, brandId, ct);
        if (!docs.Any()) return;
        var folder = Path.Combine(_env.WebRootPath, BrandFolder, brandId.ToString());
        foreach (var doc in docs)
        {
            var path = Path.Combine(folder, doc.DocName ?? "");
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
            _documentsInfoService.Delete(doc.Id);
        }
        await _documentsInfoService.SaveAsync(ct);
    }
    private static string CleanFileName(string fileName)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
            fileName = fileName.Replace(c, '_');
        return fileName;
    }
}
