//using AutoMapper;
//using ECommerce.Domain.Entities;
//using ECommerce.Application.DTOs;

using AutoMapper;
using ECommerce.Domain.Entities;
using ECommerce.Application.DTOs;

namespace ECommerce.Application.Mapping
{
    public sealed class MappingProfile : Profile
    {
        public MappingProfile()
        {            
            CreateMap<Product, ProductDto>()
                .ForMember(d => d.BrandName, o => o.MapFrom(s => s.Brand != null ? s.Brand.Name : null))
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name));
            
            CreateMap<CreateProductRequest, Product>()
                .ForMember(d => d.Slug, o => o.Ignore()) 
                .ForMember(d => d.Images, o => o.Ignore())
                .ForMember(d => d.Variants, o => o.Ignore())
                .ForMember(d => d.Attributes, o => o.Ignore())
                .ForMember(d => d.Reviews, o => o.Ignore());


            CreateMap<MenuDTO, MenuItem>();
        }
    }
    
    
}
