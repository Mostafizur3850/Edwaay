using System.Collections.Generic;

namespace ECommerce.Application.DTOs
{
    public sealed record ApiResponse<T>(
        bool Success,
        string Message,
        T? Data = default,
        string? TraceId = null,
        IDictionary<string, string[]>? Errors = null
    );

    public sealed record PagedResponse<T>(
        IReadOnlyList<T> Items,
        int Page,
        int PageSize,
        long Total
    );

    public sealed record PagedRequest(
        int Page = 1,
        int PageSize = 20
    );

    public sealed record IdNameDto(string Id, string Name);

    public static class ApiResponses
    {
        public static ApiResponse<T> Ok<T>(T data, string message = "OK", string? traceId = null)
            => new(true, message, data, traceId);

        public static ApiResponse<T> Created<T>(T data, string message = "Created", string? traceId = null)
            => new(true, message, data, traceId);

        //public static ApiResponse<object> NoData(string message = "OK", string? traceId = null)
        //    => new(true, message, null, traceId);

        // ✅ Main Fail signature (supports validation errors + traceId)
        public static ApiResponse<T> Fail<T>(
            string message,
            IDictionary<string, string[]>? errors = null,
            string? traceId = null)
            => new(false, message, default, traceId, errors);

        // ✅ Convenience overloads (so controllers can pass traceId as 2nd arg)
        public static ApiResponse<T> Fail<T>(string message, string traceId)
            => Fail<T>(message: message, errors: null, traceId: traceId);

        public static ApiResponse<object> NoData(string message, string traceId)
            => NoData(message: message, traceId: traceId);

        public static ApiResponse<T> Created<T>(T data, string traceId)
            => Created(data: data, message: "Created", traceId: traceId);

        public static ApiResponse<T> Ok<T>(T data, string traceId)
            => Ok(data: data, message: "OK", traceId: traceId);
    }
}
