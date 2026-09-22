using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using ECommerce.Infrastructure;

namespace takeuup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NewsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNews()
        {
            var news = await _context.News.OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(news);
        }

        [HttpPost]
        public async Task<IActionResult> AddNews([FromBody] News news)
        {
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return Ok(news);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return NotFound();
            
            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, [FromBody] News updatedNews)
        {
            var existingNews = await _context.News.FindAsync(id);
            if (existingNews == null) return NotFound();

            existingNews.Title = updatedNews.Title;
            existingNews.Content = updatedNews.Content;
            existingNews.ImageUrl = updatedNews.ImageUrl;
            existingNews.NewsLink = updatedNews.NewsLink;

            await _context.SaveChangesAsync();
            return Ok(existingNews);
        }
    }
}
