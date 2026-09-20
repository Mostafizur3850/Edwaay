using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IUserDeliveryAddressService
    {
        Task<List<UserDeliveryAddressDto>> GetAsync(Guid userId);
        Task UpsertAsync(Guid userId, UserDeliveryAddressUpsertDto dto);
        Task DeleteAsync(Guid userId, Guid id);

        Task CreateUserProfileAsync(UserDeliveryAddress profile);
    }
}
