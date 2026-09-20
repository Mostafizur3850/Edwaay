using ECommerce.Application.DTOs;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/feedbacks")]
    public class FeedbacksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileStorageService _fileStorage;

        public FeedbacksController(AppDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        // 🔓 GET: api/feedbacks
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Get()
        {
            var feedbacks = await _context.Feedbacks
                .Where(x => x.IsApproved)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(feedbacks);
        }

        // 🔓 POST: api/feedbacks/create
        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromForm] FeedbackCreateDto dto, CancellationToken ct)
        {
            if (dto == null) return BadRequest("Feedback details cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required.");
            if (string.IsNullOrWhiteSpace(dto.Text)) return BadRequest("Feedback text is required.");

            var feedback = new Feedback
            {
                Name = dto.Name,
                Role = dto.Role ?? "Student",
                StudentInfo = dto.StudentInfo,
                Text = dto.Text,
                ImageUrl = dto.ImageUrl,
                IsApproved = true
            };

            if (dto.ImageFile != null)
            {
                var files = new FormFileCollection { dto.ImageFile };
                var upload = await _fileStorage.UploadImageAsync(
                    files,
                    "Feedbacks",
                    feedback.Id,
                    "feedback_",
                    ct);

                feedback.ImageUrl = upload.FirstOrDefault()?.DocPath;
            }

            _context.Feedbacks.Add(feedback);
            await _context.CommitAsync();

            return Ok(feedback);
        }
    }
}
