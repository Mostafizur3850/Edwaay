using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobCategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobCategoriesController(AppDbContext db)
        {
            _db = db;
        }

        // 🔓 Public: Get all active categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            await EnsureBanglaCategoriesSeededAsync();
            var categories = await _db.JobCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }

        // 🔒 Admin: Get all categories (including inactive)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminCategories()
        {
            await EnsureBanglaCategoriesSeededAsync();
            var categories = await _db.JobCategories
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Ok(categories);
        }

        private async Task EnsureBanglaCategoriesSeededAsync()
        {
            try
            {
                var hasBangla = await _db.JobCategories.AnyAsync(c => c.Name == "সরকারি চাকরি");
                if (!hasBangla)
                {
                    var defaultCategories = new List<JobCategory>
                    {
                        new() { Name = "সরকারি চাকরি", Slug = "govt-jobs", IsActive = true },
                        new() { Name = "ব্যাংক জবস", Slug = "bank-jobs", IsActive = true },
                        new() { Name = "এনজিও জবস", Slug = "ngo-jobs", IsActive = true },
                        new() { Name = "শিক্ষক নিয়োগ", Slug = "teacher-recruitment", IsActive = true },
                        new() { Name = "সেলস/মার্কেটিং", Slug = "sales-marketing", IsActive = true },
                        new() { Name = "রেলওয়ে জবস", Slug = "railway-jobs", IsActive = true },
                        new() { Name = "ডিফেন্স জবস", Slug = "defense-jobs", IsActive = true },
                        new() { Name = "হেলথ/মেডিকেল", Slug = "health-medical", IsActive = true },
                        new() { Name = "চাকরির পত্রিকা", Slug = "job-circular", IsActive = true },
                        new() { Name = "বেসরকারি চাকরি", Slug = "private-jobs", IsActive = true },
                        new() { Name = "সফটওয়্যার ইঞ্জিনিয়ারিং", Slug = "special-software", IsActive = true },
                        new() { Name = "পার্ট টাইম জব", Slug = "special-part-time", IsActive = true },
                        new() { Name = "রিমোট জবস", Slug = "special-remote", IsActive = true },
                        new() { Name = "ইন্টার্নশিপ", Slug = "special-internship", IsActive = true }
                    };

                    foreach (var defCat in defaultCategories)
                    {
                        if (!await _db.JobCategories.AnyAsync(c => c.Name == defCat.Name || c.Slug == defCat.Slug))
                        {
                            _db.JobCategories.Add(defCat);
                        }
                    }
                    await _db.SaveChangesAsync();

                    bool hasBanglaJobs = await _db.Jobs.AnyAsync(j => j.Category == "সরকারি চাকরি");
                    if (!hasBanglaJobs)
                    {
                        var allCats = await _db.JobCategories.ToListAsync();
                        var catGovt = allCats.FirstOrDefault(c => c.Slug == "govt-jobs");
                        var catBank = allCats.FirstOrDefault(c => c.Slug == "bank-jobs");
                        var catNgo = allCats.FirstOrDefault(c => c.Slug == "ngo-jobs");
                        var catTeacher = allCats.FirstOrDefault(c => c.Slug == "teacher-recruitment");
                        var catSales = allCats.FirstOrDefault(c => c.Slug == "sales-marketing");
                        var catRailway = allCats.FirstOrDefault(c => c.Slug == "railway-jobs");
                        var catHealth = allCats.FirstOrDefault(c => c.Slug == "health-medical");
                        var catPrivate = allCats.FirstOrDefault(c => c.Slug == "private-jobs");
                        var catSoftwareSpecial = allCats.FirstOrDefault(c => c.Slug == "special-software");

                        _db.Jobs.AddRange(
                            new Job 
                            { 
                                Title = "সহকারী পরিচালক (সাধারণ)", 
                                Company = "বাংলাদেশ ব্যাংক", 
                                Location = "মতিঝিল, ঢাকা", 
                                Salary = "৳২২,০০০ - ৳৫৩,০৬০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catGovt?.Name ?? "সরকারি চাকরি",
                                CategoryId = catGovt?.Id,
                                ExperienceLevel = "Entry Level",
                                Description = "বাংলাদেশ ব্যাংকে সহকারী পরিচালক (সাধারণ) পদে নিয়োগ বিজ্ঞপ্তি প্রকাশিত হয়েছে।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Bangladesh+Bank&background=random"
                            },
                            new Job 
                            { 
                                Title = "প্রবেশনারি অফিসার (PO)", 
                                Company = "ডাচ-বাংলা ব্যাংক লিমিটেড", 
                                Location = "ঢাকা, বাংলাদেশ", 
                                Salary = "৳৫৫,০০০ - ৳৭০,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catBank?.Name ?? "ব্যাংক জবস",
                                CategoryId = catBank?.Id,
                                ExperienceLevel = "Entry Level",
                                Description = "ডাচ-বাংলা ব্যাংক লিমিটেড আকর্ষণীয় বেতন ও সুযোগ-সুবিধা সহ একদল মেধাবী অফিসার নিয়োগ করছে।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Dutch+Bangla&background=random"
                            },
                            new Job 
                            { 
                                Title = "প্রজেক্ট কো-অর্ডিনেটর", 
                                Company = "ব্র্যাক (BRAC)", 
                                Location = "কক্সবাজার / ঢাকা", 
                                Salary = "৳৪০,০০০ - ৳৬০,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catNgo?.Name ?? "এনজিও জবস",
                                CategoryId = catNgo?.Id,
                                ExperienceLevel = "Mid Level",
                                Description = "ব্র্যাক শিক্ষা কর্মসূচির অধীনে শিশুদের প্রাথমিক শিক্ষা প্রকল্পের জন্য প্রজেক্ট কো-অর্ডিনেটর আবশ্যক।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=BRAC&background=random"
                            },
                            new Job 
                            { 
                                Title = "সহকারী শিক্ষক (গণিত ও ইংরেজি)", 
                                Company = "আইডিয়াল স্কুল অ্যান্ড কলেজ", 
                                Location = "মতিঝিল, ঢাকা", 
                                Salary = "৳২৫,০০০ - ৳৩৫,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = false,
                                Category = catTeacher?.Name ?? "শিক্ষক নিয়োগ",
                                CategoryId = catTeacher?.Id,
                                ExperienceLevel = "Entry Level",
                                Description = "মাধ্যমিক শাখার জন্য গণিত এবং ইংরেজি বিষয়ের সহকারী শিক্ষক নিয়োগ দেওয়া হবে।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Ideal+School&background=random"
                            },
                            new Job 
                            { 
                                Title = "সেলস অ্যান্ড মার্কেটিং এক্সিকিউটিভ", 
                                Company = "প্রাণ-আরএফএল গ্রুপ", 
                                Location = "চট্টগ্রাম ও ঢাকা", 
                                Salary = "৳২৮,০০০ - ৳৪৫,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = false,
                                Category = catSales?.Name ?? "সেলস/মার্কেটিং",
                                CategoryId = catSales?.Id,
                                ExperienceLevel = "Entry Level",
                                Description = "বিক্রয় কার্যক্রম সম্প্রসারণের লক্ষ্যে উদ্যমী মার্কেটিং অফিসার আবশ্যক।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Pran+RFL&background=random"
                            },
                            new Job 
                            { 
                                Title = "উপ-সহকারী প্রকৌশলী (সিভিল)", 
                                Company = "বাংলাদেশ রেলওয়ে", 
                                Location = "কমলাপুর, ঢাকা", 
                                Salary = "৳১৬,০০০ - ৳৩৮,৬৪০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catRailway?.Name ?? "রেলওয়ে জবস",
                                CategoryId = catRailway?.Id,
                                ExperienceLevel = "Entry Level",
                                Description = "বাংলাদেশ রেলওয়ের পূর্বাঞ্চল জোনে উপ-সহকারী প্রকৌশলী পদে আবেদন আহ্বান করা হচ্ছে।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=BD+Railway&background=random"
                            },
                            new Job 
                            { 
                                Title = "মেডিকেল অফিসার (ইমার্জেন্সি)", 
                                Company = "স্কয়ার হাসপাতাল লিমিটেড", 
                                Location = "পান্থপথ, ঢাকা", 
                                Salary = "৳৫৫,০০০ - ৳৮০,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catHealth?.Name ?? "হেলথ/মেডিকেল",
                                CategoryId = catHealth?.Id,
                                ExperienceLevel = "Mid Level",
                                Description = "স্কয়ার হাসপাতালের ইমার্জেন্সি ইউনিটে সেবার জন্য অভিজ্ঞ মেডিকেল অফিসার প্রয়োজন।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Square+Hospital&background=random"
                            },
                            new Job 
                            { 
                                Title = "সিনিয়র ফুল-স্ট্যাক ডেভেলপার", 
                                Company = "পাঠাও (Pathao)", 
                                Location = "গুলশান, ঢাকা / Remote", 
                                Salary = "৳৯০,০০০ - ৳১,৩০,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = true,
                                Category = catSoftwareSpecial?.Name ?? "সফটওয়্যার ইঞ্জিনিয়ারিং",
                                CategoryId = catSoftwareSpecial?.Id,
                                ExperienceLevel = "Senior Level",
                                Description = "পাঠাও প্ল্যাটফর্ম তৈরির জন্য সিনিয়র ডেভেলপার আবশ্যক।",
                                CompanyLogo = "https://logo.clearbit.com/pathao.com"
                            },
                            new Job 
                            { 
                                Title = "এক্সিকিউটিভ অফিসার (অপারেশনস)", 
                                Company = "বেক্সিমকো ফার্মা", 
                                Location = "টঙ্গী, গাজীপুর", 
                                Salary = "৳৩৫,০০০ - ৳৫০,০০০", 
                                Type = "Full-time", 
                                Destination = "Portal", 
                                IsFeatured = false,
                                Category = catPrivate?.Name ?? "বেসরকারি চাকরি",
                                CategoryId = catPrivate?.Id,
                                ExperienceLevel = "Mid Level",
                                Description = "বেক্সিমকো ফার্মাসিউটিক্যালস এর অপারেশনের জন্য দক্ষ অফিসার নিয়োগ দেওয়া হবে।",
                                CompanyLogo = "https://ui-avatars.com/api/?name=Beximco+Pharma&background=random"
                            }
                        );
                        await _db.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error auto-seeding Bangla categories: " + ex.Message);
            }
        }

        // 🔒 Admin: Create category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] JobCategoryUpsertDto dto)
        {
            var slug = !string.IsNullOrWhiteSpace(dto.Slug)
                ? dto.Slug.Trim().ToLower().Replace(" ", "-")
                : dto.Name.Trim().ToLower().Replace(" ", "-").Replace("&", "and").Replace("/", "-");

            var category = new JobCategory
            {
                Name = dto.Name.Trim(),
                Slug = slug,
                IsActive = dto.IsActive
            };

            _db.JobCategories.Add(category);
            await _db.SaveChangesAsync();

            return Ok(category);
        }

        // 🔒 Admin: Update category
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] JobCategoryUpsertDto dto)
        {
            var category = await _db.JobCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found");

            var slug = !string.IsNullOrWhiteSpace(dto.Slug)
                ? dto.Slug.Trim().ToLower().Replace(" ", "-")
                : dto.Name.Trim().ToLower().Replace(" ", "-").Replace("&", "and").Replace("/", "-");

            category.Name = dto.Name.Trim();
            category.Slug = slug;
            category.IsActive = dto.IsActive;

            category.SetUpdated();
            await _db.SaveChangesAsync();

            return Ok(category);
        }

        // 🔒 Admin: Delete category
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _db.JobCategories.FindAsync(id);
            if (category == null) return NotFound("Category not found");

            _db.JobCategories.Remove(category);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
    }

    public class JobCategoryUpsertDto
    {
        public string Name { get; set; } = default!;
        public string? Slug { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
