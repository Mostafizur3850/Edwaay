using System;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Events;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ECommerce.Application.Service;

namespace ECommerce.Infrastructure.Messaging
{
    public class EventBusBackgroundWorker : BackgroundService
    {
        private readonly InMemoryEventBus _eventBus;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EventBusBackgroundWorker> _logger;

        public EventBusBackgroundWorker(IEventBus eventBus, IServiceProvider serviceProvider, ILogger<EventBusBackgroundWorker> logger)
        {
            _eventBus = (InMemoryEventBus)eventBus;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EventBus background service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var @event = await _eventBus.Reader.ReadAsync(stoppingToken);
                    
                    _logger.LogInformation("Processing event of type {EventType} asynchronously in background...", @event.GetType().Name);

                    if (@event is JobPublishedEvent jobEvent)
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                        // Get all students
                        var students = await userManager.GetUsersInRoleAsync("Student");
                        
                        _logger.LogInformation("Found {Count} students to notify for new job post: {Title}", students.Count, jobEvent.Title);

                        foreach (var student in students)
                        {
                            var notification = new Notification
                            {
                                UserId = Guid.Parse(student.Id),
                                Title = "New Job Alert!",
                                Message = $"A new job '{jobEvent.Title}' at '{jobEvent.Company}' has been posted.",
                                Type = "JobPost",
                                RelatedId = jobEvent.JobId.ToString(),
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            };
                            dbContext.Notifications.Add(notification);

                            try 
                            {
                                await emailService.SendEmailAsync(
                                    student.Email, 
                                    "New Job Posted - TakeUUp", 
                                    $"Hello {student.FullName},<br><br>A new job <b>{jobEvent.Title}</b> has been posted by <b>{jobEvent.Company}</b>.<br><br>Check your dashboard for more details."
                                );
                            }
                            catch (Exception emailEx)
                            {
                                _logger.LogError(emailEx, "Failed to send email to {Email}", student.Email);
                            }
                        }

                        await dbContext.SaveChangesAsync();
                        _logger.LogInformation("[EMAIL NOTIFICATION & DB] Completed processing for job post: {Title}", jobEvent.Title);
                    }
                    else if (@event is CompanyRegisteredEvent companyEvent)
                    {
                        _logger.LogInformation("[ADMIN ALERT] New company registered: {Name} (Email: {Email}) pending approval.", companyEvent.Name, companyEvent.Email);
                    }
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing background event.");
                }
            }

            _logger.LogInformation("EventBus background service stopped.");
        }
    }
}
