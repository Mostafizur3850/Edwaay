using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Generic;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/events")]
    [Authorize]
    [HasPermission]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _service;
        public EventsController(IEventService service) => _service = service;
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] EventCreateUpdateDto dto, CancellationToken ct = default)
        {
            await _service.CreateAsync(dto, ct);
            return Ok();
        }
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug) => Ok(await _service.GetBySlugAsync(slug));
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
