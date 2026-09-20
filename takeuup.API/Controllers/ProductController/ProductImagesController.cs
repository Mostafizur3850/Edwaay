//using ECommerce.Application.DTOs;
//using ECommerce.Application.Service;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//    namespace ECommerce.API.Controllers.Admin;

//[ApiController]
//[Route("api/[controller]")]
//[Authorize(Roles = "Admin")]
//    public sealed class ProductImagesController : ControllerBase
//    {
//        private readonly IProductImageService _service;
//        public ProductImagesController(IProductImageService service) => _service = service;

//        [HttpGet]
//        public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductImageDto>>>> Get(string productId, CancellationToken ct)
//        {
//            var items = await _service.GetByProductAsync(productId, ct);
//            return Ok(ApiResponses.Ok(items, traceId: HttpContext.TraceIdentifier));
//        }

//        [HttpPost("upload")]
//        [RequestSizeLimit(15_000_000)] // 15MB
//        public async Task<ActionResult<ApiResponse<ProductImageDto>>> Upload(
//            string productId,
//            [FromForm] IFormFile file,
//            [FromForm] bool isPrimary = false,
//            CancellationToken ct = default)
//        {
//            if (file is null || file.Length == 0)
//                return BadRequest(ApiResponses.Fail<ProductImageDto>("File is required", traceId: HttpContext.TraceIdentifier));

//            var created = await _service.UploadAsync(productId, file, isPrimary, ct);
//            return Created(string.Empty, ApiResponses.Created(created, traceId: HttpContext.TraceIdentifier));
//        }

//        [HttpPatch("{imageId}/primary")]
//        public async Task<ActionResult<ApiResponse<object>>> SetPrimary(string productId, string imageId, CancellationToken ct)
//        {
//            var ok = await _service.SetPrimaryAsync(productId, imageId, ct);
//            if (!ok) return NotFound(ApiResponses.Fail<object>("Image not found", traceId: HttpContext.TraceIdentifier));
//            return Ok(ApiResponses.NoData("Updated", HttpContext.TraceIdentifier));
//        }

//        [HttpPost("reorder")]
//        public async Task<ActionResult<ApiResponse<object>>> Reorder(string productId, [FromBody] IReadOnlyList<string> imageIdsInOrder, CancellationToken ct)
//        {
//            var ok = await _service.ReorderAsync(productId, imageIdsInOrder, ct);
//            if (!ok) return BadRequest(ApiResponses.Fail<object>("Invalid reorder payload", traceId: HttpContext.TraceIdentifier));
//            return Ok(ApiResponses.NoData("Reordered", HttpContext.TraceIdentifier));
//        }

//        [HttpDelete("{imageId}")]
//        public async Task<IActionResult> Delete(string productId, string imageId, CancellationToken ct)
//        {
//            var ok = await _service.DeleteAsync(productId, imageId, ct);
//            return ok ? NoContent() : NotFound();
//        }
//    }
