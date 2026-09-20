using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IUserProfileService
    {
        Task<UserProfileDto> GetAsync(Guid userId);
        Task UpsertAsync(Guid userId, UserProfileUpsertDto dto);
        Task CreateUserProfileAsync(UserProfile profile);
        Task<List<LeaderboardEntryDto>> GetLeaderboardAsync();
    }
}
