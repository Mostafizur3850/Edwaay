using System;

namespace ECommerce.Domain.Entities
{
    public class TeacherInvitation : BaseEntity
    {
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string ReceiverEmail { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
    }
}
