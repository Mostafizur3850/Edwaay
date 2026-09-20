//using ECommerce.Infrastructure;
//using Microsoft.AspNetCore.Mvc;

//[ApiController]
//[Route("api/[controller]")]
//public class ErrorLogsController : ControllerBase
//{
//    private readonly AppDbContext _db;
//    public ErrorLogsController(AppDbContext db) => _db = db;

//    [HttpGet]
//    public async Task<IActionResult> Latest(int take = 50)
//    {
//        var logs = await _db.ErrorLogs
//            .OrderByDescending(x => x.Id)
//            .Take(take)
//            .Select(x => new {
//                x.Id,
//                x.CreatedAtUtc,
//                x.TraceId,
//                x.Path,
//                x.Method,
//                x.StatusCode,
//                x.Message
//            }).ToListAsync();

//        return Ok(logs);
//    }
//}
