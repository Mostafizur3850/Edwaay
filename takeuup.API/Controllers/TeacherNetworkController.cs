using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace takeuup.API.Controllers
{
    [ApiController]
    [Route("api/teachers/network")]
    [Authorize]
    public class TeacherNetworkController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeacherNetworkController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string UserEmail => User.FindFirstValue(ClaimTypes.Email)!;

        // 1. Send network invitation
        [HttpPost("invite")]
        public async Task<IActionResult> SendInvitation([FromBody] InviteRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ReceiverEmail))
                return BadRequest(new { message = "Recipient email is required." });

            var senderProfile = await _db.userProfiles.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (senderProfile == null)
                return BadRequest(new { message = "Sender profile not found." });

            if (UserEmail.Equals(dto.ReceiverEmail, StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "You cannot send a network invitation to yourself." });

            // Check if receiver teacher exists
            var receiverUser = await _userManager.FindByEmailAsync(dto.ReceiverEmail);
            if (receiverUser == null)
                return NotFound(new { message = "No registered user found with this email." });

            var isTeacher = await _userManager.IsInRoleAsync(receiverUser, "teacher");
            if (!isTeacher)
                return BadRequest(new { message = "Network invitations can only be sent to registered teachers." });

            // Check if invitation already exists
            var exists = await _db.TeacherInvitations.AnyAsync(i => 
                ((i.SenderEmail == UserEmail && i.ReceiverEmail == dto.ReceiverEmail) || 
                 (i.SenderEmail == dto.ReceiverEmail && i.ReceiverEmail == UserEmail)) &&
                i.Status != "Rejected"
            );
            if (exists)
                return BadRequest(new { message = "An invitation or network connection already exists with this teacher." });

            var invitation = new TeacherInvitation
            {
                SenderEmail = UserEmail,
                SenderName = senderProfile.Name ?? UserEmail.Split('@')[0],
                ReceiverEmail = dto.ReceiverEmail,
                Status = "Pending"
            };

            await _db.TeacherInvitations.AddAsync(invitation);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = "Professional network invitation sent successfully!" });
        }

        // 2. Get received invitations
        [HttpGet("invitations")]
        public async Task<IActionResult> GetInvitations()
        {
            var list = await _db.TeacherInvitations
                .Where(i => i.ReceiverEmail == UserEmail && i.Status == "Pending")
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return Ok(list);
        }

        // 3. Accept or Reject invitation
        [HttpPost("invitations/{id}/respond")]
        public async Task<IActionResult> RespondToInvitation(Guid id, [FromBody] RespondDto dto)
        {
            var invite = await _db.TeacherInvitations.FindAsync(id);
            if (invite == null)
                return NotFound();

            if (!invite.ReceiverEmail.Equals(UserEmail, StringComparison.OrdinalIgnoreCase))
                return Forbid();

            if (dto.Status != "Accepted" && dto.Status != "Rejected")
                return BadRequest(new { message = "Invalid response status." });

            invite.Status = dto.Status;
            invite.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = $"Invitation {dto.Status.ToLower()} successfully." });
        }

        // 4. Get active connections list
        [HttpGet("connections")]
        public async Task<IActionResult> GetConnections()
        {
            var connections = await _db.TeacherInvitations
                .Where(i => (i.SenderEmail == UserEmail || i.ReceiverEmail == UserEmail) && i.Status == "Accepted")
                .ToListAsync();

            var connectedEmails = connections.Select(c => 
                c.SenderEmail.Equals(UserEmail, StringComparison.OrdinalIgnoreCase) ? c.ReceiverEmail : c.SenderEmail
            ).ToList();

            var profiles = await _db.userProfiles
                .Where(p => connectedEmails.Contains(p.Email))
                .ToListAsync();

            var list = profiles.Select(p => new {
                p.UserId,
                p.Name,
                p.Email,
                p.ProfileImageUrl,
                p.Institution,
                p.Qualification,
                p.Bio
            }).ToList();

            return Ok(list);
        }

        // 5. Search teachers
        [HttpGet("search")]
        public async Task<IActionResult> SearchTeachers([FromQuery] string query = "")
        {
            var teachers = await _userManager.GetUsersInRoleAsync("teacher");
            var teacherEmails = teachers.Select(t => t.Email).ToList();

            var profilesQuery = _db.userProfiles
                .Where(p => teacherEmails.Contains(p.Email) && p.UserId != UserId && p.IsTeacherApproved);

            if (!string.IsNullOrWhiteSpace(query))
            {
                profilesQuery = profilesQuery.Where(p => 
                    p.Name.Contains(query) || 
                    p.Email.Contains(query) || 
                    p.Institution.Contains(query)
                );
            }

            var profiles = await profilesQuery.Take(10).ToListAsync();

            var list = profiles.Select(p => new {
                p.Name,
                p.Email,
                p.ProfileImageUrl,
                p.Institution,
                p.Qualification,
                p.Bio
            }).ToList();

            return Ok(list);
        }
    }

    public class InviteRequestDto
    {
        public string ReceiverEmail { get; set; }
    }

    public class RespondDto
    {
        public string Status { get; set; }
    }
}
