using FluentValidation;
using ECommerce.Application.DTOs;

namespace ECommerce.Application.Validators
{
    public class ProductValidator : AbstractValidator<ProductDetailsDto>
    {
        public ProductValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            //RuleFor(x => x.Price).GreaterThan(0);
        }
    }
}
