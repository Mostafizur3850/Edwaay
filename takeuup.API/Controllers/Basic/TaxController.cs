using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public sealed class TaxController : ControllerBase
{
    private readonly ITaxService _taxService;

    public TaxController(ITaxService taxService)
    {
        _taxService = taxService;
    }

    // ---------------- CREATE ----------------
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateTaxDto dto,
        CancellationToken ct)
    {
        var id = await _taxService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    // ---------------- READ ALL ----------------
  
    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var taxes = await _taxService.GetAllAsync(ct);
        return Ok(taxes);
    }

    // ---------------- READ BY ID ----------------
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var tax = await _taxService.GetByIdAsync(id, ct);

        if (tax is null)
            return NotFound();

        return Ok(tax);
    }

    // ---------------- UPDATE ----------------
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateTaxDto dto,
        CancellationToken ct)
    {
        await _taxService.UpdateAsync(id, dto, ct);
        return NoContent();
    }

    // ---------------- DELETE ----------------
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _taxService.DeleteAsync(id, ct);
        return NoContent();
    }
}
