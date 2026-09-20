using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ECommerce.Infrastructure.Auth;

public class TokenService : ITokenService
{
    private readonly JwtOptions _opt;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _db;

    public TokenService(IOptions<JwtOptions> opt, UserManager<ApplicationUser> userManager, AppDbContext db)
    {
        _opt = opt.Value;
        _userManager = userManager;
        _db = db;
    }

    //public async Task<TokenResult> CreateTokensAsync(ApplicationUser user, CancellationToken ct = default)
    //{
    //    var now = DateTime.UtcNow;
    //    var accessExp = now.AddMinutes(_opt.AccessTokenMinutes);
    //    var refreshExp = now.AddDays(_opt.RefreshTokenDays);

    //    var roles = await _userManager.GetRolesAsync(user);

    //    var claims = new List<Claim>
    //    {
    //        new(JwtRegisteredClaimNames.Sub, user.Id),
    //        new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
    //        new(ClaimTypes.NameIdentifier, user.Id),
    //        new(ClaimTypes.Name, user.UserName ?? user.Email ?? user.Id),
    //        new Claim("userNo", user.UserNo.ToString()),
    //        new("isActive", user.IsActive.ToString().ToLowerInvariant())
    //    };

    //    foreach (var r in roles)
    //        claims.Add(new Claim(ClaimTypes.Role, r));

    //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Key));
    //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    //    var jwt = new JwtSecurityToken(
    //        issuer: _opt.Issuer,
    //        audience: _opt.Audience,
    //        claims: claims,
    //        notBefore: now,
    //        expires: accessExp,
    //        signingCredentials: creds
    //    );

    //    var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
    //    var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));



    //    _db.RefreshTokens.Add(new RefreshToken
    //    {
    //        UserId = user.Id,
    //        Token = refreshToken,
    //        CreatedAtUtc = now,        
    //        ExpiresAtUtc = refreshExp,
    //        RevokedAtUtc = null
    //    });

    //    var old = await _db.RefreshTokens
    //        .Where(x => x.UserId == user.Id && x.RevokedAtUtc == null && x.ExpiresAtUtc > now)
    //        .ToListAsync(ct);

    //    foreach (var t in old)
    //        t.RevokedAtUtc = now;

    //    await _db.SaveChangesAsync(ct);

    //    return new TokenResult(accessToken, accessExp, refreshToken, refreshExp);
    //}



    public async Task<TokenResult> CreateTokensAsync(
    ApplicationUser user,
    CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var accessExp = now.AddMinutes(_opt.AccessTokenMinutes);
        var refreshExp = now.AddDays(_opt.RefreshTokenDays);

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, user.Id),
        new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
        new(ClaimTypes.NameIdentifier, user.Id),
        new(ClaimTypes.Name, user.UserName ?? user.Email ?? user.Id),
        new("userNo", user.UserNo.ToString()),
        new("isActive", user.IsActive.ToString().ToLowerInvariant())
    };

        foreach (var r in roles)
            claims.Add(new Claim(ClaimTypes.Role, r));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: _opt.Issuer,
            audience: _opt.Audience,
            claims: claims,
            notBefore: now,
            expires: accessExp,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        // 🔴 revoke old refresh tokens
        var oldTokens = await _db.RefreshTokens
            .Where(x => x.UserId == user.Id &&
                        x.RevokedAtUtc == null &&
                        x.ExpiresAtUtc > now)
            .ToListAsync(ct);

        foreach (var t in oldTokens)
            t.RevokedAtUtc = now;

        // 🟢 create new refresh token
        var refreshToken = Convert.ToBase64String(
            RandomNumberGenerator.GetBytes(64)
        );

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            CreatedAtUtc = now,
            ExpiresAtUtc = refreshExp,
            RevokedAtUtc = null
        });

        await _db.SaveChangesAsync(ct);

        return new TokenResult(accessToken, accessExp, refreshToken, refreshExp);
    }

}
