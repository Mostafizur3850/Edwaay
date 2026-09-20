using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service.ErrorLogger
{
    public interface IErrorLogger
    {
        Task LogAsync(HttpContext ctx, Exception ex, int statusCode = 500);
    }

}
