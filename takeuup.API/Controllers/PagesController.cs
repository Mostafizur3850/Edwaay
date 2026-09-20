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
namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class PagesController : ControllerBase
    {
        private readonly IPageService _pageService;
        private readonly IDocumentsInfoService _documentsInfoService;
        private readonly IWebHostEnvironment _env;
        private const string UploadPrefix = "page_";
        private const string PageFolder = "Content/photos/Page";
        public PagesController(
            IPageService pageService,
            IDocumentsInfoService documentsInfoService,
            IWebHostEnvironment env)
        {
            _pageService = pageService;
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
            var pages = await _pageService.GetAllPagesAsync(ct);
            return Ok(ApiResponses.Ok(pages, HttpContext.TraceIdentifier));
        }
        // ---------------------------------------------------
        // CREATE
        // ---------------------------------------------------
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create(
            [FromForm] CreatePageDto dto,
            CancellationToken ct)
        {
            var baseSlug = SlugHelper.Generate(dto.Title);
            var slug = baseSlug;
            var i = 1;
            while (await _pageService.AnyAsync(x => x.Slug == slug, ct))
            {
                slug = $"{baseSlug}-{i++}";
            }
            var page = new Page
            {
                Title = dto.Title,
                Slug = slug,
                DisplayLocation = dto.DisplayLocation,
                Details = dto.Details,
                MetaKeywords = dto.MetaKeywords,
                MetaDescription = dto.MetaDescription,
                IsActive = true
            };
            _pageService.AddPage(page);
            await _pageService.SaveAsync(ct);
            return Ok(ApiResponses.Ok("Page created", HttpContext.TraceIdentifier));
        }
        // ---------------------------------------------------
        // TOGGLE STATUS
        // ---------------------------------------------------
        [HttpPatch("{id:guid}/status")]
        [Authorize]
        public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken ct)
        {
            var page = await _pageService.GetByIdAsync(id, ct);
            if (page == null)
                return NotFound("Page not found");
            page.IsActive = !page.IsActive;
            await _pageService.SaveAsync(ct);
            return Ok(ApiResponses.Ok("Status updated", HttpContext.TraceIdentifier));
        }
        // ---------------------------------------------------
        // UPDATE
        // ---------------------------------------------------
        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Update( Guid id, [FromForm] UpdatePageDto dto,  CancellationToken ct)
        {
            var page = await _pageService.GetByIdAsync(id, ct);
            if (page == null)
                return NotFound("Page not found");
            page.Title = dto.Title;
            page.Slug = dto.Slug;
            page.DisplayLocation = dto.DisplayLocation;
            page.Details = dto.Details;
            page.MetaKeywords = dto.MetaKeywords;
            page.MetaDescription = dto.MetaDescription;            
            await _pageService.SaveAsync(ct);
            return Ok(ApiResponses.Ok("Page updated", HttpContext.TraceIdentifier));
        }
        // ---------------------------------------------------
        // HARD DELETE
        // ---------------------------------------------------
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> HardDelete(Guid id, CancellationToken ct)
        {
            var page = await _pageService.GetByIdAsync(id, ct);
            if (page == null)
                return NotFound("Page not found");         
            _pageService.Delete(id);
            await _pageService.SaveAsync(ct);
            return Ok(ApiResponses.Ok("Page deleted permanently", HttpContext.TraceIdentifier));
        }
        [HttpGet("{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
        {
            var page = await _pageService.GetAllPagesAsync(ct);
            var current = page.FirstOrDefault(p => p.Slug == slug);
            if (current == null)
                return NotFound();
            return Ok(current);
        }
    }
}
