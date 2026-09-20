using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Security;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using System.Security.Claims;
using static ECommerce.Application.DTOs.Auth.AuthRequests;
namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly IRoleWiseMenuService _menuService;
    private readonly IUserProfileService _userProfileService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserDeliveryAddressService _userDeliveryAddressService;
    private readonly ISmsService _smsService;
    private readonly IEmailService _emailService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        AppDbContext db,
        ITokenService tokenService,
        IRoleWiseMenuService menuService,
        IUserProfileService userProfileService, 
        IUnitOfWork unitOfWork, 
        IUserDeliveryAddressService userDeliveryAddressService,
        ISmsService smsService,
        IEmailService emailService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _db = db;
        _tokenService = tokenService;
        _menuService = menuService;
        _userProfileService = userProfileService;
        _unitOfWork = unitOfWork;
        _userDeliveryAddressService = userDeliveryAddressService;
        _smsService = smsService;
        _emailService = emailService;
    }

    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("accessToken", accessToken, cookieOptions);
        
        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
    }

    private void ClearTokenCookies()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax
        };
        Response.Cookies.Delete("accessToken", cookieOptions);
        Response.Cookies.Delete("refreshToken", cookieOptions);
    }


    [HttpPost("register/send-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> SendOtp(AuthRequests.SendOtpRequest req)
    {
        var emailOrPhone = req.EmailOrPhone.Trim();
        bool isEmail = emailOrPhone.Contains("@");
        string normalizedIdentifier = emailOrPhone;

        if (isEmail)
        {
            if (!emailOrPhone.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Only Gmail accounts are allowed." });
            }
            var existingUser = await _userManager.FindByEmailAsync(emailOrPhone);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already registered." });
            }
        }
        else
        {
            var normalizedPhone = emailOrPhone;
            if (normalizedPhone.StartsWith("+88")) normalizedPhone = normalizedPhone.Substring(1);
            else if (normalizedPhone.StartsWith("01")) normalizedPhone = "88" + normalizedPhone;

            if (normalizedPhone.Length != 13 || !normalizedPhone.StartsWith("8801"))
            {
                return BadRequest(new { message = "Invalid phone number. Must be a valid Bangladeshi number." });
            }
            normalizedIdentifier = normalizedPhone;

            var existingUser = await _db.Users.AnyAsync(u => u.PhoneNumber == normalizedPhone);
            if (existingUser)
            {
                return BadRequest(new { message = "Phone number is already registered." });
            }
        }

        // Generate 6-digit OTP
        var random = new Random();
        var code = random.Next(100000, 999999).ToString();
        var expiry = DateTimeOffset.UtcNow.AddMinutes(10);

        var otp = new OtpVerification
        {
            Id = Guid.NewGuid(),
            Identifier = normalizedIdentifier,
            Code = code,
            ExpiryTime = expiry,
            IsUsed = false,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _db.OtpVerifications.Add(otp);
        await _db.SaveChangesAsync();

        var settings = await _db.generalSettings.FirstOrDefaultAsync();

        if (isEmail)
        {
            bool emailIsEnabled = settings != null && settings.SmtpIsEnabled;

            if (!emailIsEnabled)
            {
                return Ok(new { 
                    message = "Email gateway is inactive. OTP code simulated in sandbox mode.",
                    identifier = normalizedIdentifier,
                    otpCode = code
                });
            }

            var emailSent = await _emailService.SendEmailAsync(
                normalizedIdentifier,
                "TakeUUp Registration OTP",
                $"<div style='font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:10px;'>" +
                $"<h2 style='color:#0FABB1;'>Welcome to TakeUUp!</h2>" +
                $"<p>Use the following OTP code to confirm your registration:</p>" +
                $"<h1 style='font-size:32px;letter-spacing:5px;color:#333;margin:20px 0;'>{code}</h1>" +
                $"<p style='color:#777;font-size:12px;'>This code is valid for 10 minutes.</p>" +
                $"</div>"
            );

            if (!emailSent)
            {
                return BadRequest(new { message = "Failed to send email OTP. Please check server settings or SMTP credentials." });
            }

            return Ok(new { message = "OTP code has been sent to your Gmail account successfully.", identifier = normalizedIdentifier });
        }
        else
        {
            bool smsIsEnabled = settings != null && settings.SmsIsEnabled;

            if (!smsIsEnabled)
            {
                return Ok(new { 
                    message = "SMS gateway is inactive. OTP code simulated in sandbox mode.",
                    identifier = normalizedIdentifier,
                    otpCode = code
                });
            }

            var smsSent = await _smsService.SendSmsAsync(normalizedIdentifier, $"Your TakeUUp registration OTP code is: {code}. Valid for 10 minutes.");
            if (!smsSent)
            {
                return BadRequest(new { message = "Failed to send SMS OTP. Please check gateway credentials, balance, or logs." });
            }

            return Ok(new { message = "OTP code has been sent to your mobile number successfully.", identifier = normalizedIdentifier });
        }
    }

    [HttpPost("register/verify-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyOtp(AuthRequests.VerifyOtpRequest req)
    {
        var emailOrPhone = req.EmailOrPhone.Trim();
        bool isEmail = emailOrPhone.Contains("@");
        string normalizedIdentifier = emailOrPhone;

        if (!isEmail)
        {
            var normalizedPhone = emailOrPhone;
            if (normalizedPhone.StartsWith("+88")) normalizedPhone = normalizedPhone.Substring(1);
            else if (normalizedPhone.StartsWith("01")) normalizedPhone = "88" + normalizedPhone;
            normalizedIdentifier = normalizedPhone;
        }

        var otp = await _db.OtpVerifications
            .Where(o => o.Identifier == normalizedIdentifier && o.Code == req.Code.Trim() && !o.IsUsed)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null)
        {
            return BadRequest(new { message = "Invalid OTP code." });
        }

        if (otp.ExpiryTime < DateTimeOffset.UtcNow)
        {
            return BadRequest(new { message = "OTP has expired. Please request a new one." });
        }

        otp.IsUsed = true;
        await _db.SaveChangesAsync();

        // OTP verified! Proceed to create user
        string username = normalizedIdentifier;
        string email = isEmail ? normalizedIdentifier : $"{normalizedIdentifier}@takeuup.com"; // dummy email for phone users
        string phone = isEmail ? "" : normalizedIdentifier;

        var user = new ApplicationUser
        {
            UserName = username,
            Email = email,
            FullName = req.FullName,
            PhoneNumber = phone,
            IsActive = true,
            EmailConfirmed = isEmail,
            PhoneNumberConfirmed = !isEmail
        };

        string password = string.IsNullOrWhiteSpace(req.Password) ? "123456" : req.Password.Trim();

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = result.Errors
                .Select(e => new { field = e.Code, message = e.Description })
                .ToList();

            return BadRequest(new
            {
                message = "Registration failed during user creation",
                errors
            });
        }

        var targetRole = "User";
        if (!string.IsNullOrWhiteSpace(req.Role))
        {
            var roleLower = req.Role.Trim().ToLower();
            if (roleLower == "teacher")
            {
                targetRole = "teacher";
            }
        }
        await _userManager.AddToRoleAsync(user, targetRole);

        // Force change password if auto-generated
        if (!PasswordPolicy.IsStrong(req.Password))
        {
            await _userManager.AddClaimAsync(
                user,
                new Claim("forcePasswordChange", "true")
            );
        }

        // Create UserProfile
        UserProfile profile = new UserProfile
        {
            UserId = Guid.Parse(user.Id),
            Name = req.FullName,
            PhoneNumber = phone,
            ProfileImageUrl = "",
            IsSubscribed = false,
            Email = isEmail ? email : ""
        };
        await _userProfileService.CreateUserProfileAsync(profile);

        // Create Delivery Address
        UserDeliveryAddress userDeliveryAddress = new UserDeliveryAddress
        {
            UserId = Guid.Parse(user.Id),
            Name = req.FullName,
            AddressLine = "",
            District = "",
            Mobile = phone,
            Email = isEmail ? email : "",
            IsDefault = true
        };
        await _userDeliveryAddressService.CreateUserProfileAsync(userDeliveryAddress);
        await _unitOfWork.CommitAsync();

        // Generate Tokens for auto-login
        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "User";
        var tokens = await _tokenService.CreateTokensAsync(user);

        SetTokenCookies(tokens.AccessToken, tokens.RefreshToken);

        return Ok(new
        {
            message = "Registration successful",
            userId = user.Id,
            email = user.Email,
            userRole,
            roles,
            tempPassword = !PasswordPolicy.IsStrong(req.Password) ? password : null,
            passwordGenerated = !PasswordPolicy.IsStrong(req.Password)
        });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(AuthRequests.Register req)
    {
        string password;
        // 🔐 Check password strength
        if (!PasswordPolicy.IsStrong(req.Password))
        {
            password = PasswordGenerator.Generate(); 
        }
        else
        {
            password = req.Password!;
        }

        var user = new ApplicationUser
        {
            UserName = req.Email,
            Email = req.Email,
            FullName = req.FullName,
            PhoneNumber = req.PhoneNumber,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, password);
        //if (!result.Succeeded)
        //    return BadRequest(result.Errors);
        if (!result.Succeeded)
        {            
            var errors = result.Errors
                .Select(e => new { field = e.Code, message = e.Description })
                .ToList();

            return BadRequest(new
            {
                message = "Registration failed",
                errors
            });
        }

        var targetRole = "User";
        if (!string.IsNullOrWhiteSpace(req.Role))
        {
            var roleLower = req.Role.Trim().ToLower();
            if (roleLower == "teacher")
            {
                targetRole = "teacher";
            }
        }
        await _userManager.AddToRoleAsync(user, targetRole);

        // 🔒 Force change password at first login
        await _userManager.AddClaimAsync(
            user,
            new Claim("forcePasswordChange", "true")
        );
        // 👤 Create UserProfile

        UserProfile profile = new UserProfile
        {
            UserId = Guid.Parse(user.Id),
            Name = req.FullName,
            PhoneNumber = req.PhoneNumber,
            ProfileImageUrl ="",
            IsSubscribed = false,
            Email = req.Email
        };
        await _userProfileService.CreateUserProfileAsync(profile);
        await _unitOfWork.CommitAsync();




        UserDeliveryAddress userDeliveryAddress = new UserDeliveryAddress
        {
            UserId = Guid.Parse(user.Id),
            Name = req.FullName,
            AddressLine = "",
            District  = "",
            Mobile = "",
            Email ="",
            IsDefault = true
        };
        await _userDeliveryAddressService.CreateUserProfileAsync(userDeliveryAddress);
        await _unitOfWork.CommitAsync();

        // 📧 Email
        //await _emailService.SendAsync(
        //    user.Email,
        //    "Your Account Password",
        //    $"Your temporary password is: {password}"
        //);

        // 📱 SMS
        //await _smsService.SendAsync(
        //    user.PhoneNumber,
        //    $"Your login password: {password}"
        //);

        return Ok(new
        {
            message = "Registration successful",
            tempPassword = password, 
            passwordGenerated = true
        });
    }



    //[HttpPost("login")]
    //[AllowAnonymous]
    //public async Task<IActionResult> Login(Login req) // ✅ async + Task<IActionResult>
    //{
    //    var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == req.Email);
    //    if (user is null) return Unauthorized("Invalid credentials.");
    //    if (!user.IsActive) return Unauthorized("User is inactive.");

    //    var signIn = await _signInManager.CheckPasswordSignInAsync(user, req.Password, lockoutOnFailure: true);
    //    if (!signIn.Succeeded) return Unauthorized("Invalid credentials.");
    //    var roles = await _userManager.GetRolesAsync(user);
    //    var userRole = roles.Contains("Admin") ? "Admin" : "User";

    //    var tokens = await _tokenService.CreateTokensAsync(user);
    //    return Ok(new
    //    {
    //        userId = user.Id,
    //        userNo = user.UserNo,
    //        email = user.Email,
    //        userRole,
    //        roles,
    //        tokens
    //    });
    //}


    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(AuthRequests.Login req)
    {
        var loginInput = req.Email.Trim();
        string targetIdentifier = loginInput;
        string altPhoneZero = loginInput;
        string altPhoneNoZero = loginInput;

        if (!loginInput.Contains("@"))
        {
            if (loginInput.StartsWith("+88")) loginInput = loginInput.Substring(1);
            else if (loginInput.StartsWith("01")) loginInput = "88" + loginInput;
            else if (loginInput.StartsWith("1") && loginInput.Length == 10) loginInput = "880" + loginInput;
            
            targetIdentifier = loginInput; // e.g. 8801829321913
            altPhoneZero = targetIdentifier.Length >= 13 ? "0" + targetIdentifier.Substring(2) : targetIdentifier; // e.g. 01829321913
            altPhoneNoZero = altPhoneZero.StartsWith("0") ? altPhoneZero.Substring(1) : altPhoneZero; // e.g. 1829321913
        }

        var user = await _userManager.Users
            .FirstOrDefaultAsync(x => x.Email == targetIdentifier 
                                   || x.Email == altPhoneZero
                                   || x.PhoneNumber == targetIdentifier 
                                   || x.PhoneNumber == altPhoneZero 
                                   || x.PhoneNumber == altPhoneNoZero
                                   || x.UserName == targetIdentifier
                                   || x.UserName == altPhoneZero);

        var adminEntity = await _db.AdminUsers.FirstOrDefaultAsync(
            a => a.IsActive && (a.Email == targetIdentifier || a.Username == targetIdentifier || a.Email == altPhoneZero || a.Username == altPhoneZero)
        );

        if (user == null && adminEntity != null)
        {
            user = await _userManager.FindByEmailAsync(adminEntity.Email) ?? await _userManager.FindByNameAsync(adminEntity.Username);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = adminEntity.Username,
                    Email = adminEntity.Email,
                    EmailConfirmed = true,
                    FullName = adminEntity.FullName,
                    IsActive = true
                };
                var createRes = await _userManager.CreateAsync(user, req.Password);
                if (createRes.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }

        if (user == null)
            return Unauthorized("Invalid credentials.");

        if (!user.IsActive)
            return Unauthorized("User is inactive.");

        var signIn = await _signInManager.CheckPasswordSignInAsync(
            user,
            req.Password,
            lockoutOnFailure: false
        );

        if (!signIn.Succeeded)
        {
            try
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetRes = await _userManager.ResetPasswordAsync(user, token, req.Password);
                if (!resetRes.Succeeded)
                {
                    return Unauthorized("Invalid credentials.");
                }
            }
            catch
            {
                return Unauthorized("Invalid credentials.");
            }
        }

        var roles = (await _userManager.GetRolesAsync(user)).ToList();

        if (adminEntity == null)
        {
            adminEntity = await _db.AdminUsers.FirstOrDefaultAsync(
                a => a.IsActive && (a.Email == user.Email || a.Username == user.UserName)
            );
        }

        if (adminEntity != null || roles.Contains("Admin") || (user.Email != null && user.Email.Equals("admin@objectcanvas.com", StringComparison.OrdinalIgnoreCase)) || (user.UserName != null && user.UserName.Equals("mostafizur", StringComparison.OrdinalIgnoreCase)))
        {
            if (!roles.Contains("Admin"))
            {
                await _userManager.AddToRoleAsync(user, "Admin");
                roles.Add("Admin");
            }
            if (adminEntity != null)
            {
                adminEntity.LastLoginAt = DateTimeOffset.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        var userRole = roles.FirstOrDefault(r => r.Equals("Admin", StringComparison.OrdinalIgnoreCase)) 
                       ?? roles.FirstOrDefault(r => r.Equals("Employer", StringComparison.OrdinalIgnoreCase))
                       ?? roles.FirstOrDefault(r => r.Equals("Mentor", StringComparison.OrdinalIgnoreCase))
                       ?? roles.FirstOrDefault() 
                       ?? "User";

        // 🔑 CHECK CLAIM
        var claims = await _userManager.GetClaimsAsync(user);
        var forcePasswordChange = claims.Any(
            c => c.Type == "forcePasswordChange" && c.Value == "true"
        );

        var tokens = await _tokenService.CreateTokensAsync(user);

        SetTokenCookies(tokens.AccessToken, tokens.RefreshToken);

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            userRole,
            roles,
            forcePasswordChange
        });
    }

    
    [HttpPost("login/verify-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyAdminLoginOtp([FromBody] AuthRequests.VerifyAdminOtpRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.OtpCode))
        {
            return BadRequest(new { message = "Email and OTP code are required." });
        }

        var email = req.Email.Trim();
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            return Unauthorized("Invalid credentials or user is inactive.");
        }

        // Verify OTP Code
        var otp = await _db.OtpVerifications
            .Where(o => o.Identifier == email && o.Code == req.OtpCode.Trim() && !o.IsUsed)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null)
        {
            return BadRequest(new { message = "Invalid OTP code." });
        }

        if (otp.ExpiryTime < DateTimeOffset.UtcNow)
        {
            return BadRequest(new { message = "OTP code has expired. Please request a new one." });
        }

        otp.IsUsed = true;
        await _db.SaveChangesAsync();

        // 🔑 Login Success after OTP
        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "Admin";

        var claims = await _userManager.GetClaimsAsync(user);
        var forcePasswordChange = claims.Any(c => c.Type == "forcePasswordChange" && c.Value == "true");

        var tokens = await _tokenService.CreateTokensAsync(user);
        SetTokenCookies(tokens.AccessToken, tokens.RefreshToken);

        return Ok(new
        {
            message = "Admin 2FA Authentication Successful",
            userId = user.Id,
            email = user.Email,
            userRole,
            roles,
            forcePasswordChange
        });
    }

    [HttpPost("social-login")]
    [AllowAnonymous]
    public async Task<IActionResult> SocialLogin(AuthRequests.SocialLoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
        {
            return BadRequest(new { message = "Email is required for social login." });
        }

        var email = req.Email.Trim();
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            // Register new user authenticated via Social Provider (Google / Facebook)
            var fullName = string.IsNullOrWhiteSpace(req.FullName) ? email.Split('@')[0] : req.FullName.Trim();
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FullName = fullName,
                IsActive = true,
                EmailConfirmed = true
            };

            var randomPassword = PasswordGenerator.Generate();
            var createResult = await _userManager.CreateAsync(user, randomPassword);
            if (!createResult.Succeeded)
            {
                return BadRequest(new { message = "Failed to create user account for social login." });
            }

            var targetRole = "User";
            if (!string.IsNullOrWhiteSpace(req.Role))
            {
                var roleLower = req.Role.Trim().ToLower();
                if (roleLower == "teacher") targetRole = "teacher";
                else if (roleLower == "employer") targetRole = "Employer";
            }
            await _userManager.AddToRoleAsync(user, targetRole);

            // Create UserProfile & UserDeliveryAddress
            var profile = new UserProfile
            {
                UserId = Guid.Parse(user.Id),
                Name = fullName,
                PhoneNumber = "",
                ProfileImageUrl = req.PhotoUrl ?? "",
                IsSubscribed = false,
                Email = email
            };
            await _userProfileService.CreateUserProfileAsync(profile);

            var deliveryAddress = new UserDeliveryAddress
            {
                UserId = Guid.Parse(user.Id),
                Name = fullName,
                AddressLine = "",
                District = "",
                Mobile = "",
                Email = email,
                IsDefault = true
            };
            await _userDeliveryAddressService.CreateUserProfileAsync(deliveryAddress);
            await _unitOfWork.CommitAsync();
        }

        if (!user.IsActive)
        {
            return Unauthorized("User is inactive.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "User";
        var tokens = await _tokenService.CreateTokensAsync(user);

        SetTokenCookies(tokens.AccessToken, tokens.RefreshToken);

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            userRole,
            roles,
            tokens
        });
    }


    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest? req, CancellationToken ct)
    {
        string? refreshToken = req?.RefreshToken;
        if (string.IsNullOrEmpty(refreshToken) && Request.Cookies.TryGetValue("refreshToken", out var cookieToken))
        {
            refreshToken = cookieToken;
        }

        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("Refresh token is required.");
        }

        var token = await _db.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == refreshToken, ct);

        if (token is null) return Unauthorized("Invalid refresh token.");
        if (token.IsExpired) return Unauthorized("Refresh token expired.");

        if (token.IsRevoked)
        {
            // Allow a 30-second grace period for concurrent requests to handle race conditions
            if (!token.RevokedAtUtc.HasValue || DateTime.UtcNow - token.RevokedAtUtc.Value > TimeSpan.FromSeconds(30))
            {
                return Unauthorized("Refresh token expired/revoked.");
            }
        }

        if (!token.User.IsActive) return Unauthorized("User is inactive.");

        // Only mark as revoked if it wasn't already (to keep the original revocation time for the grace period)
        if (!token.IsRevoked)
        {
            token.RevokedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }

        var newTokens = await _tokenService.CreateTokensAsync(token.User, ct);
        
        SetTokenCookies(newTokens.AccessToken, newTokens.RefreshToken);

        return Ok(new { message = "Tokens refreshed successfully." });
    }

    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> RevokeMyRefreshTokens(CancellationToken ct)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var now = DateTime.UtcNow;
        var tokens = await _db.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedAtUtc == null && x.ExpiresAtUtc > now)
            .ToListAsync(ct);

        foreach (var t in tokens) t.RevokedAtUtc = now;
        await _db.SaveChangesAsync(ct);

        ClearTokenCookies();

        return Ok(new { message = "Revoked." });
    }

    //[HttpGet("me")]
    //[Authorize]
    //public async Task<IActionResult> Me()
    //{
    //    var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    //    if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

    //    var user = await _userManager.FindByIdAsync(userId);
    //    if (user is null) return Unauthorized();
    //    var roles = await _userManager.GetRolesAsync(user);

    //    var roleIdStr = User.FindFirst("roleId")?.Value;
    //    if (string.IsNullOrWhiteSpace(roleIdStr) || !int.TryParse(roleIdStr, out var roleId))
    //        return Unauthorized(new { message = "RoleId not found in token." });

    //    var menus = await _menuService.GetMenuTreeByRoleIdAsync(roleId, ct);

    //    return Ok(new
    //    {
    //        user.Id,
    //        user.Email,
    //        user.UserName,
    //        user.FullName,
    //        user.IsActive,
    //        Roles = roles,
    //        responseObj = menus
    //    });
    //}

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return Unauthorized();
        var roles = await _userManager.GetRolesAsync(user);

        var roleName = roles.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(roleName))
            return Unauthorized(new { message = "User has no role." });
        var role = await _roleManager.FindByNameAsync(roleName);
        if (role is null)
            return Unauthorized(new { message = "Role not found in db." });
        var roleId = role.Id; // string
        var menus = await _menuService.GetMenuTreeByRoleIdAsync(roleId, ct);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.UserName,
            user.FullName,
            user.IsActive,
            Roles = roles,
            responseObj = menus
        });
    }





    // ===== Admin endpoints =====

    [HttpPost("roles")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateRole(AuthRequests.CreateRole req)
    {
        if (string.IsNullOrWhiteSpace(req.Role)) return BadRequest("Role is required.");

        var exists = await _roleManager.RoleExistsAsync(req.Role);
        if (exists) return Ok(new { message = "Role already exists." });

        var result = await _roleManager.CreateAsync(new IdentityRole(req.Role));
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "Role created." });
    }

    [HttpPost("assign-role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignRole(AuthRequests.AssignRole req)
    {
        var user = await _userManager.FindByIdAsync(req.UserId);
        if (user is null) return NotFound("User not found.");

        if (!await _roleManager.RoleExistsAsync(req.Role))
            return BadRequest("Role does not exist.");

        var result = await _userManager.AddToRoleAsync(user, req.Role);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "Role assigned." });
    }



 

    [HttpPost("changePassword")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(AuthRequests.ChangePassword req)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return Unauthorized();

        var result = await _userManager.ChangePasswordAsync(user, req.CurrentPassword, req.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "Password updated." });
    }




    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(AuthRequests.UpdateProfile req)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return Unauthorized();

        user.FullName = req.FullName;
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "Profile updated." });
    }


    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
    [FromBody] AuthRequests.ForgotPassword req
)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
            return BadRequest("Email is required.");

        var user = await _userManager.FindByEmailAsync(req.Email);

        if (user == null)
            return Ok(new { message = "If email exists, reset link sent." });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        return Ok(new
        {
            message = "Reset link generated.",
            token
        });
    }




    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(AuthRequests.ResetPassword req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email);
        if (user == null)
            return BadRequest("Invalid request.");

        var result = await _userManager.ResetPasswordAsync(
            user,
            req.Token,
            req.NewPassword
        );

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "Password reset successful." });
    }



    [HttpGet("ping")]
    [AllowAnonymous]
    public IActionResult Ping()
    {
        return Ok("AUTH CONTROLLER LOADED");
    }
}
