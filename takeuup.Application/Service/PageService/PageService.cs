using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
namespace ECommerce.Application.Service
{
    public class PageService : IPageService
    {
        private readonly IBaseRepository<Page> _pageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PageService(IBaseRepository<Page> pageRepository, IUnitOfWork unitOfWork)
        {
            _pageRepository = pageRepository;
            _unitOfWork = unitOfWork;
        }

        public void AddPage(Page page)
        {
            _pageRepository.AddAsync(page);
        }

        public async Task<Page?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return await _pageRepository.FindBy(x => x.Id == id).FirstOrDefaultAsync(ct);
        }

        public async Task<IReadOnlyList<Page>> GetAllPagesAsync(CancellationToken ct = default)
        {
            return await _pageRepository.All.ToListAsync(ct);
        }

        public void Update(Page page)
        {
            _pageRepository.Update(page);
        }

        public void Delete(Guid id)
        {
            _pageRepository.DeleteAsync(x => x.Id == id);
        }

        public async Task SaveAsync(CancellationToken ct = default)
        {
            await _unitOfWork.CommitAsync(ct);
        }

        public async Task<bool> AnyAsync(Expression<Func<Page, bool>> predicate, CancellationToken ct)
        {
            return await _pageRepository.All.AnyAsync(predicate, ct);
        }
    }
}
