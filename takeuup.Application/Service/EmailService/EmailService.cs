using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Service
{
    public class EmailService : IEmailService
    {
        private readonly IBaseRepository<GeneralSetting> _generalRepo;

        public EmailService(IBaseRepository<GeneralSetting> generalRepo)
        {
            _generalRepo = generalRepo;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var settings = await _generalRepo.All.FirstOrDefaultAsync();

                var host = (settings != null && !string.IsNullOrWhiteSpace(settings.SmtpHost)) ? settings.SmtpHost : "smtp.gmail.com";
                var port = settings != null ? settings.SmtpPort : 587;
                var fromAddress = settings?.SmtpEmail;
                var fromPassword = settings?.SmtpPassword;
                var isEnabled = settings != null && settings.SmtpIsEnabled;

                if (!isEnabled || string.IsNullOrWhiteSpace(fromAddress) || string.IsNullOrWhiteSpace(fromPassword))
                {
                    // Simulated mode (print to Console for testing)
                    Console.WriteLine($"[EMAIL SIMULATION] Sent to: {toEmail}\nSubject: {subject}\nBody: {body}\n");
                    return false;
                }

                using (var mail = new MailMessage())
                {
                    mail.From = new MailAddress(fromAddress, "TakeUUp Verification");
                    mail.To.Add(toEmail);
                    mail.Subject = subject;
                    mail.Body = body;
                    mail.IsBodyHtml = true;

                    using (var smtp = new SmtpClient(host, port))
                    {
                        smtp.Credentials = new NetworkCredential(fromAddress, fromPassword);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mail);
                        Console.WriteLine($"Email sent successfully to {toEmail}");
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to send email to {toEmail}: {ex.Message}");
                // Fallback to console print so developers can see the code in local execution
                Console.WriteLine($"[EMAIL FALLBACK] Sent to: {toEmail}\nSubject: {subject}\nBody: {body}\n");
                return false;
            }
        }
    }
}
