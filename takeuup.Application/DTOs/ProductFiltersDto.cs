using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace ECommerce.Application.DTOs
{   
    public sealed record ProductFiltersDto(
        IReadOnlyList<IdNameDto> Categories,
        IReadOnlyList<IdNameDto> Brands,
        decimal? MinPrice,
        decimal? MaxPrice
    );
}
