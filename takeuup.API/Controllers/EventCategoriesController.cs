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
    [Route("api/event-categories")]
    [Authorize]
    [HasPermission]
    public class EventCategoriesController : ControllerBase
    {
        private readonly IEventService _service; // Service a logic thakbe
        public EventCategoriesController(IEventService service) => _service = service;
        [HttpGet]
        public async Task<IActionResult> GetCategories()
            => Ok(await _service.GetAllCategoriesAsync());
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(EventCategoryCreateDto dto, CancellationToken ct = default)
        {
            await _service.CreateCategoryAsync(dto);
            return Ok();
        }
    }
}
