using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body);
    }
}
