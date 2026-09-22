using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace takeuup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NotificationsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            if (!Guid.TryParse(userIdStr, out var userId))
            {
                var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.Email == userIdStr);
                if (profile == null) return Unauthorized();
                userId = profile.UserId;
            }

            var notifications = await _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(20)
                .Select(n => new {
                    n.Id,
                    n.Title,
                    n.Message,
                    n.Type,
                    n.RelatedId,
                    n.IsRead,
                    n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var notification = await _db.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                var profile = await _db.userProfiles.FirstOrDefaultAsync(p => p.Email == userIdStr);
                if (profile == null || notification.UserId != profile.UserId) return Forbid();
            }
            else if (notification.UserId != userId)
            {
                return Forbid();
            }

            notification.IsRead = true;
            await _db.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}

