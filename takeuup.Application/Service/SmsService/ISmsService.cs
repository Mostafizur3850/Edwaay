using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface ISmsService
    {
        Task<bool> SendSmsAsync(string phoneNumber, string message);
    }
}
