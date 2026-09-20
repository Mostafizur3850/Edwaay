using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Application.DTOs.Auth;
namespace ECommerce.Application.Auth.TokenService; 

public interface ITokenService
{
    Task<TokenResult> CreateTokensAsync(ApplicationUser user, CancellationToken ct = default);
}

