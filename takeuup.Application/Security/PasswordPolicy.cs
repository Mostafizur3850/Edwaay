using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Security
{
    public static class PasswordPolicy
    {
        public static bool IsStrong(string password)
        {
            if (string.IsNullOrWhiteSpace(password)) return false;
            if (password.Length < 6) return false;

            if (!password.Any(char.IsLower)) return false;
            if (!password.Any(char.IsUpper)) return false; // ✅ uppercase required
            if (!password.Any(char.IsDigit)) return false;

            return true;
        }
    }
}
