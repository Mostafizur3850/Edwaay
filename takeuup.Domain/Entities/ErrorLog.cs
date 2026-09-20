using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class ErrorLog
    {
        public long Id { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public string TraceId { get; set; } = default!;
        public string Path { get; set; } = default!;
        public string Method { get; set; } = default!;
        public int StatusCode { get; set; }

        public string? UserId { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }

        public string ExceptionType { get; set; } = default!;
        public string Message { get; set; } = default!;
        public string? StackTrace { get; set; }
        public string? InnerException { get; set; }
    }

}
