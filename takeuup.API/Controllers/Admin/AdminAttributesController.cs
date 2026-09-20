using ECommerce.Domain.Entities;
using ECommerce.Application.DTOs;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class AdminAttributesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminAttributesController(AppDbContext db) => _db = db;

    public sealed record CreateAttr(string Name, bool IsVariantAttribute);
    public sealed record CreateOption(string Value);

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] CreateAttr req, CancellationToken ct)
    {
        var a = new AttributeDefinition { Name = req.Name, IsVariantAttribute = req.IsVariantAttribute };
        _db.AttributeDefinitions.Add(a);
        await _db.SaveChangesAsync(ct);
        return StatusCode(201, ApiResponses.Created<object>(new { a.Id }, HttpContext.TraceIdentifier));
    }

    [HttpPost("{attrId:guid}/options")]
    public async Task<ActionResult<ApiResponse<object>>> AddOption(
    Guid attrId,
    [FromBody] CreateOption req,
    CancellationToken ct)
    {
        var exists = await _db.AttributeDefinitions.AnyAsync(x => x.Id == attrId, ct);
        if (!exists)
            return NotFound(ApiResponses.Fail<object>(
                message: "Attribute not found",
                errors: null,
                traceId: HttpContext.TraceIdentifier
            ));

        var opt = new AttributeOption
        {
            AttributeDefinitionId = attrId,
            Value = req.Value
        };

        _db.AttributeOptions.Add(opt);
        await _db.SaveChangesAsync(ct);

        return StatusCode(201, ApiResponses.Created(
            data: new { opt.Id },
            traceId: HttpContext.TraceIdentifier
        ));
    }

}
