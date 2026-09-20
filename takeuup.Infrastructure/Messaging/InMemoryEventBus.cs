using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using ECommerce.Domain.Events;

namespace ECommerce.Infrastructure.Messaging
{
    public class InMemoryEventBus : IEventBus
    {
        private readonly Channel<object> _channel = Channel.CreateUnbounded<object>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });

        public ChannelReader<object> Reader => _channel.Reader;

        public async Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : class
        {
            await _channel.Writer.WriteAsync(@event, cancellationToken);
        }
    }
}
