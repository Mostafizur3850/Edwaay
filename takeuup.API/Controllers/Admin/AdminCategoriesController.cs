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
public sealed class AdminCategoriesController : ControllerBase
{
    private readonly IMediator _mediator;
    public AdminCategoriesController(IMediator mediator) => _mediator = mediator;

    public sealed record Upsert(string Name, Guid? ParentId);

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] Upsert req, CancellationToken ct)
    {
        var cat = await _mediator.Send(new ECommerce.Application.Common.CreateCategoryCommand(req.Name, req.ParentId), ct);
        return StatusCode(201, ApiResponses.Created<object>(new { cat.Id }, HttpContext.TraceIdentifier));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(
        Guid id,
        [FromBody] Upsert req,
        CancellationToken ct)
    {
        var cat = await _mediator.Send(new ECommerce.Application.Common.UpdateCategoryCommand(id, req.Name, req.ParentId), ct);
        if (cat is null)
            return NotFound(ApiResponses.Fail<object>(
                message: "Category not found",
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
        var success = await _mediator.Send(new ECommerce.Application.Common.DeleteCategoryCommand(id), ct);
        if (!success) return NotFound();
        return NoContent();
    }
}
