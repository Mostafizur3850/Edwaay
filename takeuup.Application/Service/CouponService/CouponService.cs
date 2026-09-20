using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static ECommerce.Application.DTOs.Auth.AuthRequests;

namespace ECommerce.Application.Service
{
    public class CouponService : ICouponService
    {
        private readonly IBaseRepository<Coupon> _couponRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CouponService(IBaseRepository<Coupon> couponRepository, IUnitOfWork unitOfWork)
        {
            _couponRepository = couponRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCouponAsync(CreateCouponDto dto, CancellationToken ct)
        {
            var coupon = new Coupon
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Code = dto.Code,
                NumberOfTimes = dto.NumberOfTimes,
                Discount = dto.Discount,
                DiscountType = dto.DiscountType, 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _couponRepository.AddAsync(coupon);
            await _unitOfWork.CommitAsync(ct);
        }

        public async Task<IList<Coupon>> GetAllCouponsAsync(CancellationToken ct)
        {
            return await _couponRepository.GetAllAsync(ct);
        }

        public async Task<Coupon> GetCouponByCodeAsync(string code, CancellationToken ct)
        {
            return await _couponRepository.FindBy(x => x.Code == code).FirstOrDefaultAsync(ct);
        }

        // ---------------- UPDATE ----------------
        public async Task UpdateCouponAsync(UpdateCouponDto dto, CancellationToken ct)
        {
            var coupon = await _couponRepository
                .FindBy(c => c.Id == dto.Id)
                .FirstOrDefaultAsync(ct);

            if (coupon == null)
                throw new Exception("Coupon not found");

            coupon.Title = dto.Title;
            coupon.Code = dto.Code;
            coupon.NumberOfTimes = dto.NumberOfTimes;
            coupon.Discount = dto.Discount;
            coupon.IsActive = dto.Status == "Active";
            coupon.DiscountType = dto.DiscountType; 

            _couponRepository.Update(coupon);
            await _unitOfWork.CommitAsync(ct);
        }

        // ---------------- TOGGLE STATUS ----------------
        public async Task ToggleStatusAsync(Guid id, CancellationToken ct)
        {
            var coupon = await _couponRepository
                .FindBy(c => c.Id == id)
                .FirstOrDefaultAsync(ct);

            if (coupon == null)
                throw new Exception("Coupon not found");

            coupon.IsActive = !coupon.IsActive;

            _couponRepository.Update(coupon);
            await _unitOfWork.CommitAsync(ct);
        }


        public void DeleteCouponAsync(Guid id)
        {
            _couponRepository.DeleteAsync(x => x.Id == id);
        }

    }
}
