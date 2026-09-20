using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Service
{
    public class CustomerService : ICustomerService
    {
        private readonly IBaseRepository<UserProfile> _profileRepo;
        private readonly IBaseRepository<UserDeliveryAddress> _addressRepo;
        private readonly IBaseRepository<Order> _orderRepo;
        public CustomerService(
            IBaseRepository<UserProfile> profileRepo,
            IBaseRepository<UserDeliveryAddress> addressRepo,
            IBaseRepository<Order> orderRepo)
        {
            _profileRepo = profileRepo;
            _addressRepo = addressRepo;
            _orderRepo = orderRepo;
        }

        // 🔹 List for table
        public async Task<List<CustomerListDto>> GetCustomersAsync()
        {
            return await _profileRepo.All
                .Select(u => new CustomerListDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.PhoneNumber
                })
                .OrderByDescending(x => x.Name)
                .ToListAsync();
        }

        // 🔹 Details for view modal
        public async Task<CustomerDetailsDto?> GetCustomerByUserIdAsync(Guid userId)
        {
            var profile = await _profileRepo.All
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null)
                return null;

            var totalOrders = await _orderRepo.All.CountAsync(o => o.UserId == userId);

            var address = await _addressRepo.All
                .Where(x => x.UserId == userId && x.IsDefault)
                .Select(a => new CustomerAddressDto
                {
                    Name = a.Name,
                    AddressLine = a.AddressLine,
                    District = a.District,
                    Mobile = a.Mobile,
                    Email = a.Email
                })
                .FirstOrDefaultAsync();

            return new CustomerDetailsDto
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                Phone = profile.PhoneNumber,
                IsSubscribed = profile.IsSubscribed,
                Address = address,
                CreatedAt = profile.CreatedAt,   
                TotalOrders = totalOrders,       
            };
        }

        // 🔹 Delete customer
        public async Task DeleteCustomerAsync(Guid userId)
        {
            var profile = await _profileRepo.GetAsync(x => x.UserId == userId);
            if (profile == null)
                throw new Exception("Customer not found");
            await _addressRepo.DeleteAsync(x => x.UserId == userId);
            _profileRepo.Delete(profile);
            await _addressRepo.SaveChangesAsync();
            await _profileRepo.SaveChangesAsync();
        }
    }
}
