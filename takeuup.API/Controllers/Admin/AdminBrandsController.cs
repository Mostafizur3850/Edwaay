using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminBrandsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AdminBrandsController(IMediator mediator) => _mediator = mediator;

    public sealed record Upsert(string Name);

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] Upsert req, CancellationToken ct)
    {
        var b = await _mediator.Send(new ECommerce.Application.Common.CreateBrandCommand(req.Name), ct);
        return StatusCode(201, ApiResponses.Created<object>(new { b.Id }, HttpContext.TraceIdentifier));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, [FromBody] Upsert req, CancellationToken ct)
    {
        var b = await _mediator.Send(new ECommerce.Application.Common.UpdateBrandCommand(id, req.Name), ct);
        if (b is null) return NotFound(ApiResponses.Fail<object>("Brand not found", HttpContext.TraceIdentifier));
        return Ok(ApiResponses.NoData("Updated", HttpContext.TraceIdentifier));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var success = await _mediator.Send(new ECommerce.Application.Common.DeleteBrandCommand(id), ct);
        if (!success) return NotFound();
        return NoContent();
    }
}
