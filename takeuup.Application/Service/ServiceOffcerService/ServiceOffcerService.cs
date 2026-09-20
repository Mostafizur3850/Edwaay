using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Service;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static ECommerce.Application.DTOs.Auth.AuthRequests;
namespace ECommerce.Application.Service
{
    public class ServiceOffcerService : IServiceOffcerService
    {
        private readonly IBaseRepository<ServiceOffer> _ServiceOfferRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ServiceOffcerService(IBaseRepository<ServiceOffer> ServiceOfferRepository, IUnitOfWork unitOfWork)
        {
            _ServiceOfferRepository = ServiceOfferRepository;          
            _unitOfWork = unitOfWork;
        }

        public void Add(ServiceOffer menu)
        {
            _ServiceOfferRepository.AddAsync(menu);
        }

        public IEnumerable<ServiceOffer> GetAll()
        {
            return _ServiceOfferRepository.All;
        }
          
        
        public async Task<IReadOnlyList<OfferServiceList>> GetAllAsync(CancellationToken ct = default)
        => await _ServiceOfferRepository.GetAllServicesync(ct);

        public async Task<ServiceOffer?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return await _ServiceOfferRepository.FindBy(x => x.Id == id).FirstOrDefaultAsync(ct);
        }

        public void Update(ServiceOffer menu)
        {
            _ServiceOfferRepository.Update(menu);
        }


        public void Delete(Guid id)
        {
            _ServiceOfferRepository.DeleteAsync(x => x.Id == id);
        }
        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public bool Save()
        {
            try
            {
                _unitOfWork.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> AnyAsync(
     Expression<Func<ServiceOffer, bool>> predicate,
     CancellationToken ct)
        {
            return await _ServiceOfferRepository.All.AnyAsync(predicate, ct);
        }


    }
}
