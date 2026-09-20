using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{

        public sealed class PaymentLog : BaseEntity
        {
            public Guid? PaymentId { get; set; }
            public string Event { get; set; } = default!;
            // INIT | SUCCESS | FAIL | IPN | REFUND

            public string? Payload { get; set; }
        }    

}
