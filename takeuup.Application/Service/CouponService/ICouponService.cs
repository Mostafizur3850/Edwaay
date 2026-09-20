using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ICouponService
    {
        Task CreateCouponAsync(CreateCouponDto dto, CancellationToken ct);
        Task<IList<Coupon>> GetAllCouponsAsync(CancellationToken ct);
        Task<Coupon> GetCouponByCodeAsync(string code, CancellationToken ct);
        Task UpdateCouponAsync(UpdateCouponDto coupon, CancellationToken ct);

        Task ToggleStatusAsync(Guid id, CancellationToken ct);
        void DeleteCouponAsync(Guid id);
    }
}
