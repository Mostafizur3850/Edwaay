using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IEventService
    {
        Task<List<EventListDto>> GetAllAsync();
        Task CreateAsync(EventCreateUpdateDto dto, CancellationToken ct);
        Task<EventListDto> GetBySlugAsync(string slug);
        Task DeleteAsync(Guid id);
        Task<List<EventCategoryDto>> GetAllCategoriesAsync();
        Task CreateCategoryAsync(EventCategoryCreateDto dto, CancellationToken ct = default);
        Task DeleteCategoryAsync(Guid id);
        Task<List<EventListDto>> GetByEventCategorySlugAsync(string slug);
    }
}
