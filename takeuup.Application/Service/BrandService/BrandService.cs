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
    public class BrandService : IBrandService
    {
        private readonly IBaseRepository<Brand> _brandRepository;
        private readonly IBaseRepository<ApplicationRoleMenu> _roleMenuRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BrandService(IBaseRepository<Brand> brandRepository,
            IBaseRepository<ApplicationRoleMenu> roleMenuRepository, IUnitOfWork unitOfWork)
        {
            _brandRepository = brandRepository;
            _roleMenuRepository = roleMenuRepository;
            _unitOfWork = unitOfWork;
        }

        public void AddBrand(Brand menu)
        {
            _brandRepository.AddAsync(menu);
        }

        public IEnumerable<Brand> GetAll()
        {
            return _brandRepository.All;
        }
          
        
        public async Task<IReadOnlyList<BrandListDto>> GetAllBrandAsync(CancellationToken ct = default)
        => await _brandRepository.GetAllBrandAsync(ct);

        public async Task<Brand?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return await _brandRepository
                .FindBy(x => x.Id == id)
                .FirstOrDefaultAsync(ct);
        }


        public void Update(Brand menu)
        {
            _brandRepository.Update(menu);
        }


           //public async Task Delete(Guid id)
        //{
        //    await _brandRepository.DeleteAsync(x=> x.Id == id);
        //}

        public void Delete(Guid id)
        {
            _brandRepository.DeleteAsync(x => x.Id == id);
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
     Expression<Func<Brand, bool>> predicate,
     CancellationToken ct)
        {
            return await _brandRepository.All.AnyAsync(predicate, ct);
        }


    }
}
