using System;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using MediatR;

namespace ECommerce.Application.Features.Companies.Commands
{
    public record VerifyCompanyCommand(Guid CompanyId, bool IsVerified) : IRequest<Company?>;

    public class VerifyCompanyCommandHandler : IRequestHandler<VerifyCompanyCommand, Company?>
    {
        private readonly IBaseRepository<Company> _companyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public VerifyCompanyCommandHandler(
            IBaseRepository<Company> companyRepository,
            IUnitOfWork unitOfWork)
        {
            _companyRepository = companyRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Company?> Handle(VerifyCompanyCommand request, CancellationToken cancellationToken)
        {
            var company = await _companyRepository.GetByIdAsync(request.CompanyId, cancellationToken);
            if (company == null) return null;

            company.IsVerified = request.IsVerified;
            company.UpdatedAt = DateTime.UtcNow;

            _companyRepository.Update(company);
            await _unitOfWork.CommitAsync(cancellationToken);

            return company;
        }
    }
}
