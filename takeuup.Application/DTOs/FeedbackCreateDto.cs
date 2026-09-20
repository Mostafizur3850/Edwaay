using Microsoft.AspNetCore.Http;
using System;

namespace ECommerce.Application.DTOs
{
    public class FeedbackCreateDto
    {
        public string Name { get; set; }
        public string Role { get; set; }
        public string? StudentInfo { get; set; }
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
