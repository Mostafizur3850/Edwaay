using ECommerce.Application.DTOs;
using ECommerce.API.Filters;
using ECommerce.Application.Service.HomePageService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]")]
[Authorize]
    [HasPermission]
    public class HomePageController : ControllerBase
{
    private readonly IHomePageService _service;
    public HomePageController(IHomePageService service)
    {
        _service = service;
    }
    // 🌍 Frontend (ONE CALL)
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()=> Ok(await _service.GetAsync());
    // 🔐 Admin
    [Authorize]
    [HttpPut("herobanner")]
    public async Task<IActionResult> UpdateHero([FromForm] HomeHeroBannerUpdateDto dto)
    {
        await _service.UpdateHeroBannerAsync(dto);
        return NoContent();
    }
    [Authorize]
    [HttpPut("popular-category")]
    public async Task<IActionResult> UpdatePopular(HomePopularCategoryDto dto)
    {
        await _service.UpdatePopularCategoryAsync(dto);
        return NoContent();
    }
    [Authorize]
    [HttpPut("three-column")]
    public async Task<IActionResult> UpdateThreeColumn(HomeThreeColumnDto dto)
    {
        await _service.UpdateThreeColumnCategoryAsync(dto);
        return NoContent();
    }
    [Authorize]
    [HttpPut("top-ad")]
    public async Task<IActionResult> UpdateTopAd([FromForm] HomeTopAdUpdateDto dto)
    {
        await _service.UpdateTopAdAsync(dto);
        return NoContent();
    }
}
