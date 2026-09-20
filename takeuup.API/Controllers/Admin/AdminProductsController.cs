using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AdminProductsController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] CreateProductRequest req, CancellationToken ct)
    {
        var product = await _mediator.Send(new ECommerce.Application.Common.CreateProductCommand(
            req.Name,
            req.Description,
            req.CategoryId,
            req.BrandId,
            req.Currency,
            req.IsPublished
        ), ct);

        return StatusCode(201, ApiResponses.Created<object>(new { product.Id }, HttpContext.TraceIdentifier));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(
        Guid id,
        [FromBody] UpdateProductRequest req,
        CancellationToken ct)
    {
        var p = await _mediator.Send(new ECommerce.Application.Common.UpdateProductCommand(
            id,
            req.Name,
            req.Description,
            req.CategoryId,
            req.BrandId,
            req.Currency,
            req.IsPublished
        ), ct);

        if (p is null)
            return NotFound(ApiResponses.Fail<object>(
                message: "Product not found",
                errors: null,
                traceId: HttpContext.TraceIdentifier
            ));

        return Ok(ApiResponses.NoData(
            message: "Updated",
            traceId: HttpContext.TraceIdentifier
        ));
    }

    [HttpPatch("{id:guid}/publish")]
    public async Task<ActionResult<ApiResponse<object>>> Publish(
        Guid id,
        [FromBody] PublishRequest req,
        CancellationToken ct)
    {
        var p = await _mediator.Send(new ECommerce.Application.Common.PublishProductCommand(id, req.IsPublished), ct);
        if (p is null)
            return NotFound(ApiResponses.Fail<object>(
                message: "Product not found",
                errors: null,
                traceId: HttpContext.TraceIdentifier
            ));

        return Ok(ApiResponses.NoData(
            message: "Updated",
            traceId: HttpContext.TraceIdentifier
        ));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var success = await _mediator.Send(new ECommerce.Application.Common.DeleteProductCommand(id), ct);
        if (!success) return NotFound();
        return NoContent();
    }
}
