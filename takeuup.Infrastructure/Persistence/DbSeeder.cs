using System;
using System.Linq;
using System.Threading.Tasks;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        public static async Task SeedBilingualDataAsync(AppDbContext context)
        {
            // Seed AboutUsSettings if empty or missing bilingual fields
            var aboutSettings = context.AboutUsSettings.FirstOrDefault();
            if (aboutSettings == null)
            {
                aboutSettings = new AboutUsSettings
                {
                    HeroTitle = "Democratizing Quality Education Across Bangladesh",
                    HeroSubtitle = "From HSC academics to BUET, Medical, and BCS exams—TakeUp bridges the gap with AI-driven learning.",
                    HeroTitleBn = "বাংলাদেশের প্রতিটি শিক্ষার্থীর জন্য সহজ ও নিশ্চিত মানের স্মার্ট শিক্ষা",
                    HeroTitleEn = "Democratizing Quality Smart Education For Every Student Across Bangladesh",
                    HeroSubtitleBn = "এইচএসসি একাডেমিক থেকে বুয়েট, মেডিকেল ও বিসিএস প্রস্তুতি—টেকআপ প্ল্যাটফর্ম কৃত্রিম বুদ্ধিমত্তা ও বিশ্বমানের গাইডলাইনের সাহায্যে শিক্ষা পৌঁছে দিচ্ছে দেশের প্রতিটি প্রান্তে।",
                    HeroSubtitleEn = "From HSC academics to BUET, Medical, and BCS exams—TakeUp bridges the gap with AI-driven learning and top-tier mentorship across Bangladesh.",
                    MissionText = "Quality education for all students",
                    VisionText = "AI-powered learning revolution"
                };
                context.AboutUsSettings.Add(aboutSettings);
            }
            else
            {
                aboutSettings.HeroTitleBn = "বাংলাদেশের প্রতিটি শিক্ষার্থীর জন্য সহজ ও নিশ্চিত মানের স্মার্ট শিক্ষা";
                aboutSettings.HeroTitleEn = "Democratizing Quality Smart Education For Every Student Across Bangladesh";
                aboutSettings.HeroSubtitleBn = "এইচএসসি একাডেমিক থেকে বুয়েট, মেডিকেল ও বিসিএস প্রস্তুতি—টেকআপ প্ল্যাটফর্ম কৃত্রিম বুদ্ধিমত্তা ও বিশ্বমানের গাইডলাইনের সাহায্যে শিক্ষা পৌঁছে দিচ্ছে দেশের প্রতিটি প্রান্তে।";
                aboutSettings.HeroSubtitleEn = "From HSC academics to BUET, Medical, and BCS exams—TakeUp bridges the gap with AI-driven learning and top-tier mentorship across Bangladesh.";
                context.AboutUsSettings.Update(aboutSettings);
            }

            await context.SaveChangesAsync();
        }
    }
}
