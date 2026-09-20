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
public sealed class ServiceOfficerController : ControllerBase
{
    private readonly IServiceOffcerService _serviceOffcerService;
    private readonly IDocumentsInfoService _documentsInfoService;
    private readonly IWebHostEnvironment _env;
    private const string UploadPrefix = "serviceOffer_";
    private const string ServiceOfferFolder = "Content/photos/ServiceOffer";
    public ServiceOfficerController(
         IServiceOffcerService serviceOffcerService,
        IDocumentsInfoService documentsInfoService,
        IWebHostEnvironment env)
    {
        _serviceOffcerService = serviceOffcerService;
        _documentsInfoService = documentsInfoService;
        _env = env;
    }
    // ---------------------------------------------------
    // GET ALL
    // ---------------------------------------------------
    [HttpGet("getAll")]
    [Authorize]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var brands = await _serviceOffcerService.GetAllAsync(ct);
        return Ok(ApiResponses.Ok(brands, HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // CREATE
    // ---------------------------------------------------
    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> Create(
        [FromForm] CreateOfferServiceDto dto,
        CancellationToken ct)
    {
        var ServiceOffer = new ServiceOffer
        {
            Name = dto.Name,
            Details = dto.Details,
           ServiceLogo = null,  
        };
        _serviceOffcerService.Add(ServiceOffer);
        await _serviceOffcerService.SaveAsync(ct);
        if (dto.ServiceLogo != null && dto.ServiceLogo.Count > 0)
        {
            var uploadedDocs = await UploadImageAsync(dto.ServiceLogo, ServiceOffer.Id, ct);
            var lastDocPath = uploadedDocs.LastOrDefault()?.DocPath;
            foreach (var d in uploadedDocs)
            {
                _documentsInfoService.Add(new DocumentsInfo
                {
                    DocName = d.DocName,
                    DocPath = d.DocPath,
                    DocType = (int)EnumDocType.ServiceOffer,
                    DocSourceId = ServiceOffer.Id,
                    SourceFolder = ServiceOffer.Id.ToString()
                });
            }
            await _documentsInfoService.SaveAsync(ct);
            var dbServiceOffer = await _serviceOffcerService.GetByIdAsync(ServiceOffer.Id, ct);
            if (dbServiceOffer != null)
            {
                dbServiceOffer.ServiceLogo = lastDocPath;
                _serviceOffcerService.Update(dbServiceOffer);
                await _serviceOffcerService.SaveAsync(ct);
            }
        }
        return Ok(ApiResponses.Ok("Brand created", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // UPDATE
    // ---------------------------------------------------
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid id,
        [FromForm] UpdateOfferServiceDto dto,
        CancellationToken ct)
    {
        var serviceOffer = await _serviceOffcerService.GetByIdAsync(id, ct);
        if (serviceOffer == null)
            return NotFound("Brand not found");
        serviceOffer.Name = dto.Name;
        serviceOffer.Details = dto.Details;
        if (dto.ServiceLogo != null && dto.ServiceLogo.Count > 0)
        {
            await DeletePrevFilesAsync(id, ct);
            var uploadedDocs = await UploadImageAsync(dto.ServiceLogo, id, ct);
            serviceOffer.ServiceLogo = uploadedDocs.LastOrDefault()?.DocPath;
        }
        await _serviceOffcerService.SaveAsync(ct);
        return Ok(ApiResponses.Ok("Brand updated", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // HARD DELETE
    // ---------------------------------------------------
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> HardDelete(Guid id, CancellationToken ct)
    {
        var brand = await _serviceOffcerService.GetByIdAsync(id, ct);
        if (brand == null)
         return NotFound("Brand not found");     
        await DeletePrevFilesAsync(id, ct);
        _serviceOffcerService.Delete(id);
        await _serviceOffcerService.SaveAsync(ct);
        return Ok(ApiResponses.Ok("Brand deleted permanently", HttpContext.TraceIdentifier));
    }
    // ---------------------------------------------------
    // FILE UPLOAD (ASYNC)
    // ---------------------------------------------------
    private async Task<List<VMDocInfoDTO>> UploadImageAsync(
        IFormFileCollection files,
        Guid serviceOfferId,
        CancellationToken ct)
    {
        var list = new List<VMDocInfoDTO>();
        var root = Path.Combine(_env.WebRootPath, "Content", "photos", "ServiceOffer", serviceOfferId.ToString());
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
                DocPath = $"Content/photos/ServiceOffer/{serviceOfferId}/{savedName}"
            });
        }
        return list;
    }
    // ---------------------------------------------------
    // DELETE FILES (ASYNC SAFE)
    // ---------------------------------------------------
    private async Task DeletePrevFilesAsync(Guid ServiceOfferId, CancellationToken ct)
    {
        var docs = await _documentsInfoService
            .GetByDocTypeAndSourceAsync((int)EnumDocType.ServiceOffer, ServiceOfferId, ct);
        if (!docs.Any()) return;
        var folder = Path.Combine(_env.WebRootPath, ServiceOfferFolder, ServiceOfferId.ToString());
        foreach (var doc in docs)
        {
            var path = Path.Combine(folder, doc.DocName ?? "");
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
           await _documentsInfoService.Delete(doc.Id);
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
