using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Application.Service.ErrorLogger
{
    public class DbErrorLogger : IErrorLogger
    {
        private readonly IBaseRepository<ErrorLog> _errorLogRepository;

        public DbErrorLogger(IBaseRepository<ErrorLog> errorLogRepository)
        {
            _errorLogRepository = errorLogRepository;
        }

        public async Task LogAsync(HttpContext ctx, Exception ex, int statusCode = 500)
        {
            var userAgent = ctx.Request.Headers.TryGetValue("User-Agent", out var ua)
                ? ua.ToString()
                : null;

            await _errorLogRepository.AddAsync(new ErrorLog
            {
                TraceId = ctx.TraceIdentifier,
                Path = ctx.Request.Path,
                Method = ctx.Request.Method,
                StatusCode = statusCode,
                IpAddress = ctx.Connection.RemoteIpAddress?.ToString(),
                UserAgent = userAgent,
                ExceptionType = ex.GetType().FullName ?? "Exception",
                Message = ex.Message,
                StackTrace = ex.StackTrace,
                InnerException = ex.InnerException?.ToString()
            });

            await _errorLogRepository.SaveChangesAsync();
        }
    }
}
