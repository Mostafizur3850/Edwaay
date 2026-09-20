using System;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Events;
using ECommerce.Domain.Repository;
using FluentValidation;
using MediatR;

namespace ECommerce.Application.Features.Jobs.Commands
{
    public record CreateJobCommand(
        string Title,
        string Company,
        string Location,
        string Salary,
        string Type,
        string Destination,
        bool IsFeatured,
        string? Description,
        string? Requirements,
        string? Responsibilities,
        string? Benefits,
        string? Category,
        string? ExperienceLevel,
        string? CompanyLogo,
        Guid? CompanyId,
        Guid? CategoryId
    ) : IRequest<Job>;

    public class CreateJobCommandValidator : AbstractValidator<CreateJobCommand>
    {
        public CreateJobCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Job title is required.");
            RuleFor(x => x.Company).NotEmpty().WithMessage("Company name is required.");
            RuleFor(x => x.Location).NotEmpty().WithMessage("Job location is required.");
            RuleFor(x => x.Salary).NotEmpty().WithMessage("Salary details are required.");
            RuleFor(x => x.Type).Must(type => type == "Full-time" || type == "Part-time" || type == "Internship" || type == "Contract")
                .WithMessage("Job Type must be Full-time, Part-time, Internship, or Contract.");
        }
    }

    public class CreateJobCommandHandler : IRequestHandler<CreateJobCommand, Job>
    {
        private readonly IBaseRepository<Job> _jobRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEventBus _eventBus;

        public CreateJobCommandHandler(
            IBaseRepository<Job> jobRepository, 
            IUnitOfWork unitOfWork,
            IEventBus eventBus)
        {
            _jobRepository = jobRepository;
            _unitOfWork = unitOfWork;
            _eventBus = eventBus;
        }

        public async Task<Job> Handle(CreateJobCommand request, CancellationToken cancellationToken)
        {
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Company = request.Company,
                Location = request.Location,
                Salary = request.Salary,
                Type = request.Type,
                Destination = request.Destination,
                IsFeatured = request.IsFeatured,
                Description = request.Description,
                Requirements = request.Requirements,
                Responsibilities = request.Responsibilities,
                Benefits = request.Benefits,
                Category = request.Category,
                ExperienceLevel = request.ExperienceLevel,
                CompanyLogo = request.CompanyLogo,
                CompanyId = request.CompanyId,
                CategoryId = request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _jobRepository.AddAsync(job, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            // Publish job published event asynchronously
            await _eventBus.PublishAsync(new JobPublishedEvent(job.Id, job.Title, job.Company), cancellationToken);

            return job;
        }
    }
}
