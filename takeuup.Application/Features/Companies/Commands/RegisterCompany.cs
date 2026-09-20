using System;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Events;
using ECommerce.Domain.Repository;
using FluentValidation;
using MediatR;

namespace ECommerce.Application.Features.Companies.Commands
{
    public record RegisterCompanyCommand(
        string Name,
        string? Email,
        string? Phone,
        string? Website,
        string? Logo,
        string? Address,
        string? Description,
        string? UserId
    ) : IRequest<Company>;

    public class RegisterCompanyCommandValidator : AbstractValidator<RegisterCompanyCommand>
    {
        public RegisterCompanyCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Company Name is required.");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("A valid corporate email address is required.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Contact phone number is required.");
        }
    }

    public class RegisterCompanyCommandHandler : IRequestHandler<RegisterCompanyCommand, Company>
    {
        private readonly IBaseRepository<Company> _companyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEventBus _eventBus;

        public RegisterCompanyCommandHandler(
            IBaseRepository<Company> companyRepository,
            IUnitOfWork unitOfWork,
            IEventBus eventBus)
        {
            _companyRepository = companyRepository;
            _unitOfWork = unitOfWork;
            _eventBus = eventBus;
        }

        public async Task<Company> Handle(RegisterCompanyCommand request, CancellationToken cancellationToken)
        {
            var company = new Company
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Website = request.Website,
                Logo = request.Logo,
                Address = request.Address,
                Description = request.Description,
                IsVerified = false,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _companyRepository.AddAsync(company, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            // Publish company registered event
            await _eventBus.PublishAsync(new CompanyRegisteredEvent(company.Id, company.Name, company.Email ?? ""), cancellationToken);

            return company;
        }
    }
}
