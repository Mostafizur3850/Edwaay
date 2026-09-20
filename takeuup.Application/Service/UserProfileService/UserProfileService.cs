using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Application.DTOs;

namespace ECommerce.Application.Service
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IBaseRepository<UserProfile> _repo;
        private readonly IFileStorageService _fileStorage;
        private readonly IUnitOfWork _uow;

        public UserProfileService(
            IBaseRepository<UserProfile> repo,
            IFileStorageService fileStorage,
            IUnitOfWork uow)
        {
            _repo = repo;
            _fileStorage = fileStorage;
            _uow = uow;
        }


        public async Task CreateUserProfileAsync(UserProfile profile)
        {
            await _repo.AddAsync(profile);
        }

        // ================= GET =================
        public async Task<UserProfileDto> GetAsync(Guid userId)
        {
            var profile = await _repo.All
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null) return null;

            return new UserProfileDto
            {
                Name = profile.Name,
                PhoneNumber = profile.PhoneNumber,
                ProfileImageUrl = profile.ProfileImageUrl,
                IsSubscribed = profile.IsSubscribed,
                Email = profile.Email,
                JoinDate = profile.CreatedAt.ToString("MMMM dd, yyyy"),
                Streak = profile.Streak,
                Points = profile.Points,
                StudentClass = profile.StudentClass,
                SelectedSubjectsJson = profile.SelectedSubjectsJson,
                TargetGoalsJson = profile.TargetGoalsJson,
                UnlockedGoalsJson = profile.UnlockedGoalsJson,
                GoalProgressJson = profile.GoalProgressJson,
                RoutineTasksJson = profile.RoutineTasksJson,
                MistakesJson = profile.MistakesJson,
                IsTeacherApproved = profile.IsTeacherApproved,
                IsProfileCompleted = profile.IsProfileCompleted,
                Institution = profile.Institution,
                Qualification = profile.Qualification,
                Bio = profile.Bio
            };
        }

        // ================= UPSERT =================
        public async Task UpsertAsync(Guid userId, UserProfileUpsertDto dto)
        {
            var profile = await _repo.All
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null)
            {
                profile = new UserProfile
                {
                    UserId = userId,
                    Name = "",
                    PhoneNumber = "",
                    Email = "",
                    ProfileImageUrl = ""
                };
                await _repo.AddAsync(profile);
            }

            profile.Name = dto.Name ?? profile.Name ?? "";
            profile.PhoneNumber = dto.PhoneNumber ?? profile.PhoneNumber ?? "";
            profile.IsSubscribed = dto.IsSubscribed;
            profile.Streak = dto.Streak;
            profile.Points = dto.Points;
            profile.StudentClass = dto.StudentClass;
            profile.SelectedSubjectsJson = dto.SelectedSubjectsJson;
            profile.TargetGoalsJson = dto.TargetGoalsJson;
            profile.UnlockedGoalsJson = dto.UnlockedGoalsJson;
            profile.GoalProgressJson = dto.GoalProgressJson;
            profile.RoutineTasksJson = dto.RoutineTasksJson;
            profile.MistakesJson = dto.MistakesJson;
            profile.Institution = dto.Institution;
            profile.Qualification = dto.Qualification;
            profile.Bio = dto.Bio;

            if (!string.IsNullOrWhiteSpace(profile.Institution) && 
                !string.IsNullOrWhiteSpace(profile.Qualification) && 
                !string.IsNullOrWhiteSpace(profile.Name) && 
                !string.IsNullOrWhiteSpace(profile.PhoneNumber))
            {
                profile.IsProfileCompleted = true;
            }

            // ---------- Profile Image ----------
            if (dto.ProfileImage != null)
            {
                await _fileStorage.DeletePrevFilesAsync(
                    EnumDocType.Profile,
                    "UserProfile",
                    profile.Id,
                    CancellationToken.None);

                var upload = await _fileStorage.UploadImageAsync(
                    new FormFileCollection { dto.ProfileImage },
                    "UserProfile",
                    profile.Id,
                    "profile_",
                    CancellationToken.None);

                profile.ProfileImageUrl = upload.First().DocPath;
            }

            profile.SetUpdated();
            await _uow.CommitAsync();
        }

        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync()
        {
            var profiles = await _repo.All
                .OrderByDescending(x => x.Points)
                .Take(20)
                .ToListAsync();

            var list = new List<LeaderboardEntryDto>();
            int rank = 1;
            foreach (var p in profiles)
            {
                list.Add(new LeaderboardEntryDto
                {
                    Id = p.UserId.ToString(),
                    Rank = rank++,
                    Name = p.Name ?? "Student",
                    Points = p.Points,
                    Avatar = !string.IsNullOrEmpty(p.ProfileImageUrl) ? p.ProfileImageUrl : "https://picsum.photos/id/64/200",
                    Trend = rank % 3 == 0 ? "up" : rank % 3 == 1 ? "down" : "same",
                    Institution = p.Institution ?? "Dhaka College"
                });
            }
            return list;
        }
    }
}
