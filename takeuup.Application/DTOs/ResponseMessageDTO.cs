using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class ResponseMessageDTO
    {
        public object data { get; set; }
        public object ResponseObj { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
    }
}
