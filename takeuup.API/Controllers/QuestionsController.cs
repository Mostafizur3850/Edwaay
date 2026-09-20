using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public QuestionsController(AppDbContext db) => _db = db;
        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResponse<ProductQuestion>>>> Get(Guid productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 50);
            var q = _db.productQuestions.AsNoTracking().Where(r => r.ProductId == productId && r.IsApproved);
            var total = await q.LongCountAsync(ct);
            var items = await q.OrderByDescending(r => r.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize).ToListAsync(ct);
            return Ok(ApiResponses.Ok(new PagedResponse<ProductQuestion>(items, page, pageSize, total), HttpContext.TraceIdentifier));
        }
        public sealed record CreateQuestionRequest(string Question);
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Create(Guid productId, [FromBody] CreateQuestionRequest req, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(req.Question))
                return BadRequest(ApiResponses.Fail<object>("Question cannot be empty", HttpContext.TraceIdentifier));
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var uid))
                return Unauthorized(ApiResponses.Fail<object>("Invalid user", HttpContext.TraceIdentifier));
            var exists = await _db.Products.AnyAsync(p => p.Id == productId && p.IsPublished, ct);
            if (!exists) return NotFound(ApiResponses.Fail<object>("Product not found", HttpContext.TraceIdentifier));
            var question = new ProductQuestion
            {
                ProductId = productId,
                UserId = uid,
                Question = req.Question,
                IsApproved = false 
            };
            _db.productQuestions.Add(question);
            await _db.SaveChangesAsync(ct);
            return StatusCode(201, ApiResponses.Created<object>(new { question.Id }, HttpContext.TraceIdentifier));
        }
        [HttpGet("admin/all")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<PagedResponse<ProductQuestion>>>> GetAllForAdmin([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var q = _db.productQuestions.AsNoTracking();
            var total = await q.LongCountAsync(ct);
            var items = await q.OrderByDescending(r => r.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize).ToListAsync(ct);
            return Ok(ApiResponses.Ok(new PagedResponse<ProductQuestion>(items, page, pageSize, total), HttpContext.TraceIdentifier));
        }
        public sealed record UpdateQuestionRequest(string Answer, bool IsApproved);
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, [FromBody] UpdateQuestionRequest req, CancellationToken ct)
        {
            var question = await _db.productQuestions.FirstOrDefaultAsync(q => q.Id == id, ct);
            if (question == null)
                return NotFound(ApiResponses.Fail<object>("Question not found", HttpContext.TraceIdentifier));
            question.Answer = req.Answer;
            question.IsApproved = req.IsApproved;
            question.UpdatedAt = DateTime.UtcNow; 
            await _db.SaveChangesAsync(ct);
            return Ok(ApiResponses.Ok<object>(new { message = "Question updated successfully" }, HttpContext.TraceIdentifier));
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
        {
            var question = await _db.productQuestions.FirstOrDefaultAsync(q => q.Id == id, ct);
            if (question == null)
                return NotFound(ApiResponses.Fail<object>("Question not found", HttpContext.TraceIdentifier));
            _db.productQuestions.Remove(question);
            await _db.SaveChangesAsync(ct);
            return Ok(ApiResponses.Ok<object>(new { message = "Question deleted" }, HttpContext.TraceIdentifier));
        }
    }
}
