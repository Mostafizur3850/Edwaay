using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public static class BrandExtensions
{

    public static async Task<IReadOnlyList<BrandListDto>>GetAllBrandAsync( this IBaseRepository<Brand> brandRepository,
  CancellationToken ct = default)    {
        return await brandRepository.All
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new BrandListDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                LogoUrl = x.LogoUrl,
                IsActive = x.IsActive
            })
            .ToListAsync(ct);
    }



    public static async Task<IReadOnlyList<OfferServiceList>> GetAllServicesync(this IBaseRepository<ServiceOffer> serviceOfferRepository,
CancellationToken ct = default)
    {
        return await serviceOfferRepository.All
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new OfferServiceList
            {
                Id = x.Id,
                Name = x.Name,
                Details = x.Details,
                serviceLogo = x.ServiceLogo        
            })
            .ToListAsync(ct);
    }

}
