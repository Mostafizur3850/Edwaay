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
    public class CurrentAffairsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CurrentAffairsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _context.CurrentAffairQuestions.OrderByDescending(q => q.CreatedAt).ToListAsync();
            return Ok(questions);
        }

        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromBody] CurrentAffairQuestion question)
        {
            _context.CurrentAffairQuestions.Add(question);
            await _context.SaveChangesAsync();
            return Ok(question);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] CurrentAffairQuestion updatedQuestion)
        {
            var question = await _context.CurrentAffairQuestions.FindAsync(id);
            if (question == null) return NotFound();
            
            question.QuestionText = updatedQuestion.QuestionText;
            question.OptionA = updatedQuestion.OptionA;
            question.OptionB = updatedQuestion.OptionB;
            question.OptionC = updatedQuestion.OptionC;
            question.OptionD = updatedQuestion.OptionD;
            question.CorrectOption = updatedQuestion.CorrectOption;
            question.Explanation = updatedQuestion.Explanation;
            
            await _context.SaveChangesAsync();
            return Ok(question);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.CurrentAffairQuestions.FindAsync(id);
            if (question == null) return NotFound();
            
            _context.CurrentAffairQuestions.Remove(question);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}
