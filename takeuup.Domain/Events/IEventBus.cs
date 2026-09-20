using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Domain.Events
{
    public interface IEventBus
    {
        Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : class;
    }
}
