    using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Generic;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.API.Controllers;
    [ApiController]
    [Route("api/[controller]")]
    public sealed class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ISkuGenerator _skuGenerator;   
        public ProductController(IProductService productService, ISkuGenerator skuGenerator)
        {
            _productService = productService;
            _skuGenerator = skuGenerator;
        }
    #region backend part
    [HttpPost("getAll")]
    [HasPermission("/admin/dashboard/products", PermissionType.View)]
    public async Task<IActionResult> GetAll([FromBody] CategoryProductFilterDto filter)
    {
        filter.Page = filter.Page <= 0 ? 1 : filter.Page;
        filter.PageSize = filter.PageSize <= 0 ? 50 : filter.PageSize;
        var isAdmin = User.IsInRole("Admin");
        filter.UserRole = isAdmin;
        var result = await _productService.GetAllFilteredAsync(filter);
        return Ok(new
        {
            items = result.Items,
            totalCount = result.TotalCount
        });
    }
    [HttpPost("create")]
        [HasPermission("/admin/dashboard/products", PermissionType.Create)]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto,    CancellationToken ct)
        {
            var id = await _productService.CreateAsync(dto, ct);
            return Ok(new { success = true, id });
        }
        [HttpPut("{id}")]
        [HasPermission("/admin/dashboard/products", PermissionType.Edit)]
        public async Task<IActionResult> Update(  Guid id,  [FromForm] UpdateProductDto dto,  CancellationToken ct
    )
        {
            dto = dto with { Id = id };
            await _productService.UpdateAsync(dto, ct);
            return Ok(new { success = true });
        }
        [HttpGet("{id}")]
        [HasPermission("/admin/dashboard/products", PermissionType.View)]
        public async Task<IActionResult> Get(Guid id, CancellationToken ct)
        {
            var product = await _productService.GetByIdAsync(id);
            return product == null ? NotFound() : Ok(product);
        }
        [HttpPost("previewSku")]
        [Authorize]
        public ActionResult<PreviewSkuResponseDto> PreviewSku(
          [FromBody] PreviewSkuDto dto
      )
        {
            var tempProduct = new Product
            {
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId
            };
            var sku = _skuGenerator.Generate(tempProduct);
            return Ok(new PreviewSkuResponseDto
            {
                Sku = sku
            });
        }
        [HttpPatch("{id}/toggle-status")]
        [HasPermission("/admin/dashboard/products", PermissionType.Edit)]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            await _productService.ToggleStatusAsync(id);
            return Ok();
        }
        [HttpDelete("{id}")]
        [HasPermission("/admin/dashboard/products", PermissionType.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _productService.DeleteAsync(id, ct);
            return Ok(new { success = true });
        }
        #endregion
        #region frontend part
        [HttpGet("getBySlug/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> getBySlug(string slug)
        {
            return Ok(await _productService.getBySlug(slug));
        }
    [HttpPost("getCategoryWiseProductBySlug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategoryWiseProductBySlug(
    string slug,
    [FromBody] CategoryProductFilterDto filter
)
    {
        filter.Page = filter.Page <= 0 ? 1 : filter.Page;
        filter.PageSize = filter.PageSize <= 0 ? 20 : filter.PageSize;
        var result = await _productService.GetCategoryWiseFilteredAsync(slug, filter);
        return Ok(new
        {
            items = result.Items,
            totalCount = result.TotalCount
        });
    }
    [HttpGet("getAllHomeProduct")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllHomeProduct()
    {
        return Ok(await _productService.GetAllAsync());
    }
    [HttpPost("getHomeProducts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHomeProducts(
    [FromBody] CategoryProductFilterDto filter
)
    {
        filter.Page = filter.Page <= 0 ? 1 : filter.Page;
        filter.PageSize = filter.PageSize <= 0 ? 20 : filter.PageSize;
        var result = await _productService.GetAllFilteredAsync(filter);
        return Ok(new
        {
            items = result.Items,
            totalCount = result.TotalCount
        });
    }
    [HttpGet("suggest")]
    [AllowAnonymous]
    public async Task<IActionResult> Suggest([FromQuery] string keyword)
    {
        var result = await _productService.SuggestAsync(keyword);
        return Ok(result);
    }
    [HttpGet("tags")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTags()
    {
        var tags = await _productService.GetUniqueTagsAsync();
        return Ok(tags);
    }
    #endregion
}
