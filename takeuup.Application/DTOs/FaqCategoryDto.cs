using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class FaqCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public bool IsActive { get; set; }
    }

    public class FaqCreateUpdateDto
    {
        public string Title { get; set; } = "";
        public Guid CategoryId { get; set; }
        public string Details { get; set; } = "";
        public bool IsActive { get; set; }
    }

    public class FaqListDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = "";

        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = "";
        public string Details { get; set; } = "";

        public bool IsActive { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }

}
