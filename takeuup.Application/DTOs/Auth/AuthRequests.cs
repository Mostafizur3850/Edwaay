using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs.Auth
{
     public static class AuthRequests
    {
        public record Register(string Email, string Password, string FullName, string PhoneNumber, string? Role = "User");
        public record SendOtpRequest(string EmailOrPhone, string FullName, string Password, string? Role = "User");
        public record VerifyOtpRequest(string EmailOrPhone, string Code, string FullName, string Password, string? Role = "User");
        public record SocialLoginRequest(string Provider, string Email, string FullName, string? PhotoUrl, string? Role = "User");
        public record Login(string Email, string Password);
        public record VerifyAdminOtpRequest(string Email, string OtpCode);
        public record Refresh(string RefreshToken);
        public record AssignRole(string UserId, string Role);
        public record CreateRole(string Role);

        public sealed record ChangePassword(string CurrentPassword, string NewPassword);
        public sealed record UpdateProfile(string FullName);

        public sealed record ForgotPassword(string Email);

        public sealed record ResetPassword(  string Email, string Token,  string NewPassword );
    }
}
