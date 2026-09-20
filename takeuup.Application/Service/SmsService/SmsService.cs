using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ECommerce.Application.Service
{
    public class SmsService : ISmsService
    {
        private readonly HttpClient _httpClient;
        private readonly IBaseRepository<GeneralSetting> _generalRepo;

        public SmsService(HttpClient httpClient, IBaseRepository<GeneralSetting> generalRepo)
        {
            _httpClient = httpClient;
            _generalRepo = generalRepo;
        }

        public async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            try
            {
                var settings = await _generalRepo.All.FirstOrDefaultAsync();
                if (settings == null || !settings.SmsIsEnabled)
                {
                    // SMS is disabled globally, log it and return false
                    Console.WriteLine($"SMS not sent to {phoneNumber} (disabled): {message}");
                    return false;
                }

                // Normalise phone number to 8801xxxxxxxxx format
                var formattedPhone = phoneNumber.Trim();
                if (formattedPhone.StartsWith("+88"))
                {
                    formattedPhone = formattedPhone.Substring(1);
                }
                else if (formattedPhone.StartsWith("01"))
                {
                    formattedPhone = "88" + formattedPhone;
                }

                var apikey = settings.SmsApiKey;
                var secretkey = settings.SmsSecretKey;
                
                // Use the custom caller ID if configured; otherwise fallback to Songbird default
                var callerID = !string.IsNullOrWhiteSpace(settings.SmsCallerId) ? settings.SmsCallerId : "8801847";

                var payload = new
                {
                    apikey = apikey,
                    secretkey = secretkey,
                    callerID = callerID,
                    toUser = formattedPhone,
                    messageContent = message
                };

                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var endpoint = "http://sms.songbirdtelecom.com:8746/sendtext";
                
                var response = await _httpClient.PostAsync(endpoint, content);
                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic result = JsonConvert.DeserializeObject(responseBody);
                    if (result != null && result.Status != null && result.Status.ToString() == "0")
                    {
                        Console.WriteLine($"SMS sent successfully to {formattedPhone}: {message}");
                        return true;
                    }
                    else
                    {
                        string errText = result?.Text?.ToString() ?? "Unknown error";
                        Console.Error.WriteLine($"SMS Gateway returned error: {errText} (Status: {result?.Status})");
                    }
                }
                else
                {
                    Console.Error.WriteLine($"SMS Gateway HTTP failure: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Exception in SendSmsAsync: {ex.Message}");
            }

            return false;
        }
    }
}
