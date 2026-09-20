using System;

namespace ECommerce.Domain.Events
{
    public class JobPublishedEvent
    {
        public Guid JobId { get; }
        public string Title { get; }
        public string Company { get; }
        public DateTime PublishedAt { get; }

        public JobPublishedEvent(Guid jobId, string title, string company)
        {
            JobId = jobId;
            Title = title;
            Company = company;
            PublishedAt = DateTime.UtcNow;
        }
    }

    public class CompanyRegisteredEvent
    {
        public Guid CompanyId { get; }
        public string Name { get; }
        public string Email { get; }
        public DateTime RegisteredAt { get; }

        public CompanyRegisteredEvent(Guid companyId, string name, string email)
        {
            CompanyId = companyId;
            Name = name;
            Email = email;
            RegisteredAt = DateTime.UtcNow;
        }
    }
}
