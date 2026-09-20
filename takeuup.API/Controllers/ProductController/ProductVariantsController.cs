//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using ECommerce.Application.DTOs;
//using ECommerce.Application.Service;
//namespace ECommerce.API.Controllers;

//[ApiController]
//[Route("api/[controller]")]
//[Authorize(Roles = "Admin")]
//public sealed class ProductVariantsController : ControllerBase
//{
//    private readonly IProductVariantService _service;
//    public ProductVariantsController(IProductVariantService service) => _service = service;

//    [HttpGet]
//    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductVariantDto>>>> Get(string productId, CancellationToken ct)
//    {
//        var items = await _service.GetByProductAsync(productId, ct);
//        return Ok(ApiResponses.Ok(items, traceId: HttpContext.TraceIdentifier));
//    }

//    [HttpPost]
//    public async Task<ActionResult<ApiResponse<ProductVariantDto>>> Create(string productId, [FromBody] ProductVariantDto req, CancellationToken ct)
//    {
//        var created = await _service.CreateAsync(productId, req, ct);
//        return CreatedAtAction(nameof(Get), new { productId }, ApiResponses.Created(created, traceId: HttpContext.TraceIdentifier));
//    }

//    [HttpPut("{variantId}")]
//    public async Task<ActionResult<ApiResponse<ProductVariantDto>>> Update(string productId, string variantId, [FromBody] ProductVariantDto req, CancellationToken ct)
//    {
//        var updated = await _service.UpdateAsync(productId, variantId, req, ct);
//        if (updated is null) return NotFound(ApiResponses.Fail<ProductVariantDto>("Variant not found", traceId: HttpContext.TraceIdentifier));
//        return Ok(ApiResponses.Ok(updated, traceId: HttpContext.TraceIdentifier));
//    }

//    [HttpDelete("{variantId}")]
//    public async Task<IActionResult> Delete(string productId, string variantId, CancellationToken ct)
//    {
//        var ok = await _service.DeleteAsync(productId, variantId, ct);
//        return ok ? NoContent() : NotFound();
//    }
//}
