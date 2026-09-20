using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{

    public class UserDeliveryAddressService : IUserDeliveryAddressService
    {
        private readonly IBaseRepository<UserDeliveryAddress> _repo;
        private readonly IUnitOfWork _uow;

        public UserDeliveryAddressService(
            IBaseRepository<UserDeliveryAddress> repo,
            IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        // ================= GET =================
        public async Task<List<UserDeliveryAddressDto>> GetAsync(Guid userId)
        {
            return await _repo.All
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.IsDefault)
                .Select(x => new UserDeliveryAddressDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    AddressLine = x.AddressLine,
                    District = x.District,
                    Mobile = x.Mobile,
                    Email = x.Email,
                    IsDefault = x.IsDefault
                })
                .ToListAsync();
        }

        // ================= UPSERT =================
        public async Task UpsertAsync(Guid userId, UserDeliveryAddressUpsertDto dto)
        {
            UserDeliveryAddress address;

            if (dto.Id.HasValue)
            {
                address = await _repo.GetByIdAsync(dto.Id.Value)
                    ?? throw new Exception("Address not found");
            }
            else
            {
                address = new UserDeliveryAddress
                {
                    UserId = userId
                };
                await _repo.AddAsync(address);
            }

            address.Name = dto.Name;
            address.AddressLine = dto.AddressLine;
            address.District = dto.District;
            address.Mobile = dto.Mobile;
            address.Email = dto.Email;

            // ---------- Default Address Logic ----------
            if (dto.IsDefault)
            {
                var all = await _repo.All
                    .Where(x => x.UserId == userId)
                    .ToListAsync();

                foreach (var item in all)
                {
                    item.IsDefault = false;
                    item.SetUpdated();
                }
            }

            address.IsDefault = dto.IsDefault;
            address.SetUpdated();

            await _uow.CommitAsync();
        }

        // ================= DELETE =================
        public async Task DeleteAsync(Guid userId, Guid id)
        {
            var address = await _repo.All
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId)
                ?? throw new Exception("Address not found");

            await _repo.DeleteAsync(x => x.Id == id);
            await _uow.CommitAsync();
        }


        public async Task CreateUserProfileAsync(UserDeliveryAddress profile)
        {
            await _repo.AddAsync(profile);
        }
    }
}
