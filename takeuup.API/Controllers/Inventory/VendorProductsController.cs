using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Vendor")]
public sealed class VendorProductsController : ControllerBase
{
    private readonly IVendorProductService _service;
    public VendorProductsController(IVendorProductService service) => _service = service;

    private string VendorId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("VendorId missing");

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<ProductListItemDto>>>> MyListings([FromQuery] ProductQuery query, CancellationToken ct)
    {
        var res = await _service.MyListingsAsync(VendorId, query, ct);
        return Ok(ApiResponses.Ok(res, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDetailsDto>>> Create([FromBody] CreateProductRequest req, CancellationToken ct)
    {
        var created = await _service.CreateListingAsync(VendorId, req, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponses.Created(created, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPut("{productId}")]
    public async Task<ActionResult<ApiResponse<ProductDetailsDto>>> Update(string productId, [FromBody] UpdateProductRequest req, CancellationToken ct)
    {
        var updated = await _service.UpdateListingAsync(VendorId, productId, req, ct);
        if (updated is null) return NotFound(ApiResponses.Fail<ProductDetailsDto>("Product not found", traceId: HttpContext.TraceIdentifier));
        return Ok(ApiResponses.Ok(updated, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("{productId}/submit")]
    public async Task<ActionResult<ApiResponse<object>>> SubmitForApproval(string productId, CancellationToken ct)
    {
        var ok = await _service.SubmitForApprovalAsync(VendorId, productId, ct);
        if (!ok) return NotFound(ApiResponses.Fail<object>("Product not found", traceId: HttpContext.TraceIdentifier));
        return Ok(ApiResponses.NoData("Submitted for approval", HttpContext.TraceIdentifier));
    }
}
