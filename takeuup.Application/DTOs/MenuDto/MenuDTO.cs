using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class MenuDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public required string Url { get; set; }
        public bool WithoutView { get; set; } = false;
        public string? Icon { get; set; }
        public int? Sequence { get; set; }
   
        public string ParentTitle { get; set; } = "";

    }

    public sealed class MenuTreeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Url { get; set; } = "";
        public string? Icon { get; set; }
        public bool WithoutView { get; set; }
        public int? ParentId { get; set; }
        public int Sequence { get; set; }
        public List<int> Permissions { get; set; } = new();
        public List<MenuTreeDto> Children { get; set; } = new();
    }


    public class MyMenuDto
    {
        public int MenuId { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public List<string> Permissions { get; set; }
    }
}
