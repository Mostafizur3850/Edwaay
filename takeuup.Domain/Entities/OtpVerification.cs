using System;

namespace ECommerce.Domain.Entities
{
    public class OtpVerification : BaseEntity
    {
        public string Identifier { get; set; } = "";
        public string Code { get; set; } = "";
        public DateTimeOffset ExpiryTime { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
