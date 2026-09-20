using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service.HomePageService
{
    public interface IHomePageService
    {
        Task<HomePageDto> GetAsync();

        Task UpdateHeroBannerAsync(HomeHeroBannerUpdateDto dto);
        Task UpdatePopularCategoryAsync(HomePopularCategoryDto dto);
        Task UpdateThreeColumnCategoryAsync(HomeThreeColumnDto dto);
        Task UpdateTopAdAsync(HomeTopAdUpdateDto dto);
    }

}
