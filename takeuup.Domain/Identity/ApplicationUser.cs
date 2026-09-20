using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace ECommerce.Domain.Entities
{


    public class ApplicationUser : Microsoft.AspNetCore.Identity.IdentityUser
    {
        public string? FullName { get; set; }
        public bool IsActive { get; set; } = true;
        public int UserNo { get; private set; }
    }

}
