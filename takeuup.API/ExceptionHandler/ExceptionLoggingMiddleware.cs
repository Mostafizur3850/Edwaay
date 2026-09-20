using System.Security.Claims;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class ExceptionLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ExceptionLoggingMiddleware> _logger;

    public ExceptionLoggingMiddleware(
        RequestDelegate next,
        IServiceScopeFactory scopeFactory,
        IWebHostEnvironment env,
        ILogger<ExceptionLoggingMiddleware> logger)
    {
        _next = next;
        _scopeFactory = scopeFactory;
        _env = env;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var traceId = context.TraceIdentifier;

            // ✅ DB log (fail হলেও main response break না)
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var userId = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                var userAgent = context.Request.Headers.TryGetValue("User-Agent", out var ua)
                    ? ua.ToString()
                    : null;

                db.ErrorLogs.Add(new ErrorLog
                {
                    TraceId = traceId,
                    Path = context.Request.Path,
                    Method = context.Request.Method,
                    StatusCode = StatusCodes.Status500InternalServerError,
                    UserId = userId,
                    IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = userAgent,
                    ExceptionType = ex.GetType().FullName ?? "Exception",
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerException = ex.InnerException?.ToString()
                });

                await db.SaveChangesAsync();
            }
            catch (Exception logEx)
            {
                // ✅ logging fail হলেও app চলবে, কিন্তু server log এ রেখে দিলাম
                _logger.LogError(logEx, "Failed to write error log to database. TraceId={TraceId}", traceId);
            }

            // ✅ Client response
            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var payload = new
            {
                message = _env.IsDevelopment()
                    ? ex.Message
                    : "Something went wrong. Use TraceId to contact support.",
                traceId,
                stack = _env.IsDevelopment() ? ex.StackTrace : null
            };

            await context.Response.WriteAsJsonAsync(payload);
        }
    }
}
