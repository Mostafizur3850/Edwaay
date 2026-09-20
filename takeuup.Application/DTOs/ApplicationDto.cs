using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class HomeTopAdDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Subtitle { get; set; }
        public string Url { get; set; } = "";
        public bool IsActive { get; set; }
        public List<HomeHeroBannerDto> HeroBanners { get; set; }
        public List<HomeHeroBannerDto> HeroSideBanners { get; set; }

    }



    public class HomeTopAdUpdateDto
    {
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? Url { get; set; }
        public bool? IsActive { get; set; }

        public IFormFile? ImageFile { get; set; }
    }


    public class HomeHeroBannerDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Subtitle { get; set; }
        public string Url { get; set; } = "";
        public int SortOrder { get; set; }
    }


    public class HomeHeroBannerUpdateDto
    {
        public Guid? Id { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? Url { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsActive { get; set; }
        public IFormFile? ImageFile { get; set; }
    }



    public class HomePopularCategoryDto
    {
        public string SectionTitle { get; set; } = "";
        public List<HomeCategoryItemDto> Categories { get; set; } = new();
    }



    public class HomeCategoryItemDto
    {
        public Guid CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? ChildCategoryId { get; set; }
        public int SortOrder { get; set; }
    }


    public class HomeThreeColumnDto
    {
        public string SectionTitle { get; set; } = "";
        public List<HomeCategoryItemDto> Categories { get; set; } = new();
    }


    public class HomePageDto
    {
        public HomeTopAdDto? TopAd { get; set; }
        public List<HomeHeroBannerDto> HeroBanners { get; set; } = new();
        public HomePopularCategoryDto? PopularCategories { get; set; }
        public HomeThreeColumnDto? ThreeColumnCategories { get; set; }
        public List<HomeTopAdDto> TopAds { get; set; }
    }


}
