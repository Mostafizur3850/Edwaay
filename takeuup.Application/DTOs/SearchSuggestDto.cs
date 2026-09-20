using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class SearchSuggestDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string? FeatureImageUrl { get; set; }
        public string? CategorySlug { get; set; }
        public decimal? Price { get; set; }
    }
}
