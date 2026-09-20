using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace ECommerce.Application.Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IBaseRepository<UserProfile> _profileRepo;
        private readonly IBaseRepository<Question> _questionRepo;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IBaseRepository<UserProfile> profileRepo,
            IBaseRepository<Question> questionRepo)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _profileRepo = profileRepo;
            _questionRepo = questionRepo;
        }

        public async Task CreateUserAsync(UserCreateDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FullName = dto.FullName,
                IsActive = true,
                NormalizedUserName= dto.UserName.ToUpper(),
                NormalizedEmail= dto.Email.ToUpper(),
                EmailConfirmed =true,
                //PasswordHash= dto.Password,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        public async Task<List<UserWithRolesDto>> GetAllUsersWithRolesAsync()
        {
            var users = _userManager.Users.ToList();
            var list = new List<UserWithRolesDto>();

            // Query profiles and questions in memory to prevent N+1 DB loops
            var profiles = await _profileRepo.All.AsNoTracking().ToListAsync();
            var questionsGrouped = await _questionRepo.All.AsNoTracking()
                .GroupBy(q => q.CreatedBy)
                .Select(g => new { CreatedBy = g.Key, Count = g.Count() })
                .ToListAsync();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var profile = profiles.FirstOrDefault(p => p.UserId.ToString() == user.Id || p.Email.ToLower() == user.Email.ToLower());
                
                var questionsCount = 0;
                if (!string.IsNullOrEmpty(user.Email))
                {
                    var qGroup = questionsGrouped.FirstOrDefault(g => g.CreatedBy != null && g.CreatedBy.ToLower() == user.Email.ToLower());
                    if (qGroup != null)
                    {
                        questionsCount = qGroup.Count;
                    }
                }

                list.Add(new UserWithRolesDto
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    IsActive = user.IsActive,
                    Roles = roles.ToList(),
                    Streak = profile?.Streak ?? 0,
                    Points = profile?.Points ?? 0,
                    StudentClass = profile?.StudentClass,
                    QuestionsCount = questionsCount,
                    IsTeacherApproved = profile?.IsTeacherApproved ?? false,
                    IsProfileCompleted = profile?.IsProfileCompleted ?? false,
                    Institution = profile?.Institution,
                    Qualification = profile?.Qualification
                });
            }

            return list;
        }

        public async Task UpdateUserStatusAsync(UserStatusUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found");

            user.IsActive = dto.IsActive;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));
        }

     
        public async Task UpdateUserAsync(UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found");

            if (!string.IsNullOrEmpty(dto.UserName))
                user.UserName = dto.UserName;

            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));

      
            if (!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (!currentRoles.Contains(dto.Role))
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    await _userManager.AddToRoleAsync(user, dto.Role);
                }
            }
        }
    
        public async Task DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));
        }

        }
    }
