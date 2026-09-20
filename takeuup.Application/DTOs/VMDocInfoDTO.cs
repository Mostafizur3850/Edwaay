using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class VMDocInfoDTO
    {
        public string DocName { get; set; }
        public string DocPath { get; set; }
        public string SourceFolder { get; set; }
        public string FileType { get; set; }
    }
}
