using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class CreatePageDto
    {
        public string Title { get; set; }
        public string DisplayLocation { get; set; } = "both";
        public string Details { get; set; }
        public string MetaKeywords { get; set; }
        public string MetaDescription { get; set; }
        public IFormFileCollection Logo { get; set; }
    }


    public class UpdatePageDto
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string DisplayLocation { get; set; }
        public string Details { get; set; }
        public string MetaKeywords { get; set; }
        public string MetaDescription { get; set; }
        public IFormFileCollection Logo { get; set; }
    }

}
