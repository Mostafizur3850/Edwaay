using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public static class PasswordGenerator
    {
        public static string Generate(int length = 12)
        {
            if (length < 6)
                length = 6;

            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string special = "!@#$%&*";

            var random = new Random();

            // ensure at least one of each
            var passwordChars = new[]
            {
                upper[random.Next(upper.Length)],
                lower[random.Next(lower.Length)],
                digits[random.Next(digits.Length)],
                special[random.Next(special.Length)]
            }.ToList();

            // fill remaining
            string allChars = upper + lower + digits + special;

            while (passwordChars.Count < length)
            {
                passwordChars.Add(allChars[random.Next(allChars.Length)]);
            }

            // shuffle
            return new string(passwordChars
                .OrderBy(x => random.Next())
                .ToArray());
        }
    }
}
