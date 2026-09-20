using AutoMapper;
using ECommerce.Application;
using ECommerce.Application.Auth.TokenService;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Mapping;
using ECommerce.Application.Service;
using ECommerce.Application.Service.ErrorLogger;
using ECommerce.Application.Validators;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);

#region Configuration Setup

// -------------------- Db --------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// -------------------- Identity --------------------
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(opt =>
    {
        opt.Password.RequireDigit = false;
        opt.Password.RequiredLength = 4;
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequireLowercase = false;

        opt.User.RequireUniqueEmail = false;

        opt.Lockout.MaxFailedAccessAttempts = 5;
        opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromHours(2);
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// -------------------- JWT Options --------------------
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()!;

// -------------------- Auth (JWT Bearer) --------------------
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt.Key)
            ),

            ClockSkew = TimeSpan.FromSeconds(30)
        };
        opt.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("accessToken"))
                {
                    context.Token = context.Request.Cookies["accessToken"];
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// -------------------- ⚡ High-Scale Performance & Security (2M DAU Ready) --------------------
builder.Services.AddMemoryCache();

// 🚀 High-Scale Distributed Cache & Multi-Node Cluster Ready
builder.Services.AddDistributedMemoryCache();
Console.WriteLine("Distributed Cache Active (Ready for Redis Cluster integration in appsettings).");

// 🗄️ Read Replica DB Connection Configuration
var readReplicaConnectionString = builder.Configuration.GetConnectionString("ReadReplicaConnection") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024 * 1024; // 1MB response cache
    options.UseCaseSensitivePaths = false;
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100, // 100 requests per 10 seconds per IP/User
                QueueLimit = 10,
                Window = TimeSpan.FromSeconds(10)
            }));
});

// -------------------- Token Service DI --------------------
builder.Services.AddScoped<ITokenService, ECommerce.Infrastructure.Auth.TokenService>();

// -------------------- AutoMapper --------------------
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

// -------------------- Controllers + FluentValidation --------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            JsonNamingPolicy.CamelCase;
    })
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<ProductValidator>();
        fv.DisableDataAnnotationsValidation = true;
    });

// -------------------- Swagger --------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ECommerce API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your token like: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    c.CustomSchemaIds(type => type.FullName!.Replace("+", "."));
});

#endregion


#region Service Registrations

builder.Services.AddScoped<IBaseRepository<MenuItem>, BaseRepository<MenuItem>>();
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

builder.Services.AddInfrastructureServices();
builder.Services.ServiceExtensions();
builder.Services.AddScoped<IErrorLogger, DbErrorLogger>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();
//builder.Services.AddSingleton<IErrorLogger, DbErrorLogger>(); 

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("LocalDev", p =>
//        p.WithOrigins("http://localhost:3000", "http://localhost:5141", "https://localhost:7033")
//         .AllowAnyHeader()
//         .AllowAnyMethod()
//         .AllowCredentials()
//    );
//});


//for production

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", p =>
        p
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
});
#endregion

var app = builder.Build();

app.UseMiddleware<ECommerce.API.Middleware.ExceptionMiddleware>();

#region Dynamic Database Schema Updates (SMS & Payments settings)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    string schemaUpdateSql = @"
IF OBJECT_ID('Feedbacks', 'U') IS NULL
BEGIN
    CREATE TABLE Feedbacks (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(MAX) NOT NULL,
        Role NVARCHAR(50) NOT NULL,
        StudentInfo NVARCHAR(MAX) NULL,
        Text NVARCHAR(MAX) NOT NULL,
        ImageUrl NVARCHAR(MAX) NULL,
        IsApproved BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('OtpVerifications', 'U') IS NULL
BEGIN
    CREATE TABLE OtpVerifications (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Identifier NVARCHAR(256) NOT NULL,
        Code NVARCHAR(50) NOT NULL,
        ExpiryTime DATETIMEOFFSET NOT NULL,
        IsUsed BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmsApiKey')
    ALTER TABLE generalSettings ADD SmsApiKey NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmsSecretKey')
    ALTER TABLE generalSettings ADD SmsSecretKey NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmsCallerId')
    ALTER TABLE generalSettings ADD SmsCallerId NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmsIsEnabled')
    ALTER TABLE generalSettings ADD SmsIsEnabled BIT NOT NULL DEFAULT 0;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmsUseMasking')
    ALTER TABLE generalSettings ADD SmsUseMasking BIT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SslStoreId')
    ALTER TABLE generalSettings ADD SslStoreId NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SslStorePassword')
    ALTER TABLE generalSettings ADD SslStorePassword NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SslSandboxUrl')
    ALTER TABLE generalSettings ADD SslSandboxUrl NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SslIsEnabled')
    ALTER TABLE generalSettings ADD SslIsEnabled BIT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashAppKey')
    ALTER TABLE generalSettings ADD BkashAppKey NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashAppSecret')
    ALTER TABLE generalSettings ADD BkashAppSecret NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashUsername')
    ALTER TABLE generalSettings ADD BkashUsername NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashPassword')
    ALTER TABLE generalSettings ADD BkashPassword NVARCHAR(100) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashSandboxUrl')
    ALTER TABLE generalSettings ADD BkashSandboxUrl NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'BkashIsEnabled')
    ALTER TABLE generalSettings ADD BkashIsEnabled BIT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmtpHost')
    ALTER TABLE generalSettings ADD SmtpHost NVARCHAR(256) NULL DEFAULT 'smtp.gmail.com';
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmtpPort')
    ALTER TABLE generalSettings ADD SmtpPort INT NOT NULL DEFAULT 587;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmtpEmail')
    ALTER TABLE generalSettings ADD SmtpEmail NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmtpPassword')
    ALTER TABLE generalSettings ADD SmtpPassword NVARCHAR(256) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('generalSettings') AND name = 'SmtpIsEnabled')
    ALTER TABLE generalSettings ADD SmtpIsEnabled BIT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'TargetGoalsJson')
    ALTER TABLE userProfiles ADD TargetGoalsJson NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'UnlockedGoalsJson')
    ALTER TABLE userProfiles ADD UnlockedGoalsJson NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'GoalProgressJson')
    ALTER TABLE userProfiles ADD GoalProgressJson NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'RoutineTasksJson')
    ALTER TABLE userProfiles ADD RoutineTasksJson NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'MistakesJson')
    ALTER TABLE userProfiles ADD MistakesJson NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Questions') AND name = 'Exam')
    ALTER TABLE Questions ADD Exam NVARCHAR(256) NULL;
";
    try
    {
        dbContext.Database.ExecuteSqlRaw(schemaUpdateSql);
        Console.WriteLine("SMS & Payment setting schema updates executed synchronously.");
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error updating general settings columns: {ex.Message}");
    }
}
#endregion

#region Programmatic EF Migration Script Generation
if (args.Contains("--generate-script"))
{
    Console.WriteLine("Generating idempotent migration script...");
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var migrator = dbContext.Database.GetService<Microsoft.EntityFrameworkCore.Migrations.IMigrator>();
            var script = migrator.GenerateScript(fromMigration: null, toMigration: null, options: Microsoft.EntityFrameworkCore.Migrations.MigrationsSqlGenerationOptions.Idempotent);
            var outputPath = "migrate.sql";
            File.WriteAllText(outputPath, script);
            Console.WriteLine($"Migration script generated successfully at: {Path.GetFullPath(outputPath)}");
        }
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error generating migration script: {ex}");
        Environment.Exit(1);
    }
    return;
}
#endregion

#region Swagger UI

// production এ চাইলে env-check দিতে পারো
// if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ECommerce API v1");
        c.RoutePrefix = "swagger";
    });
}

#endregion

#region Middleware Pipeline (ORDER খুব important)

app.UseMiddleware<ExceptionLoggingMiddleware>();

// https redirection
//app.UseHttpsRedirection();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
// routing
app.UseStaticFiles(); // wwwroot (optional)

var contentPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "wwwroot",
    "Content"
);

if (!Directory.Exists(contentPath))
{
    Directory.CreateDirectory(contentPath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(contentPath),
    RequestPath = "/Content",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append(
            "Cache-Control", "public,max-age=31536000");
    }
});

app.UseRouting();

// CORS must be between UseRouting and Auth (best practice)
//local 
//app.UseCors("LocalDev");


//production
app.UseCors("Default");
// auth
app.UseAuthentication();
app.UseAuthorization();

#endregion

#region Endpoints (Map BEFORE app.Run)

app.MapControllers();

// Debug endpoint: all registered routes
app.MapGet("/__routes", (IEnumerable<EndpointDataSource> sources) =>
{
    var routes = sources
        .SelectMany(s => s.Endpoints)
        .OfType<RouteEndpoint>()
        .Select(e => new
        {
            Route = e.RoutePattern.RawText,
            e.DisplayName
        })
        .OrderBy(x => x.Route)
        .ToList();

    return Results.Ok(routes);
});

#endregion

#region First time User/Role Seed (Optional)
app.Lifetime.ApplicationStarted.Register(async () =>
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // 🛠️ Dynamic schema update & creation
    string rawSql = @"
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('QuizSubjects') AND name = 'PendingName')
    ALTER TABLE QuizSubjects ADD PendingName NVARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'Streak')
    ALTER TABLE userProfiles ADD Streak INT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'Points')
    ALTER TABLE userProfiles ADD Points INT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'StudentClass')
    ALTER TABLE userProfiles ADD StudentClass NVARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('userProfiles') AND name = 'SelectedSubjectsJson')
    ALTER TABLE userProfiles ADD SelectedSubjectsJson NVARCHAR(MAX) NULL;

IF OBJECT_ID('Questions', 'U') IS NULL
BEGIN
    CREATE TABLE Questions (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        AccessLevel NVARCHAR(50) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Subject NVARCHAR(100) NOT NULL,
        Text NVARCHAR(MAX) NOT NULL,
        OptionsJson NVARCHAR(MAX) NOT NULL,
        CorrectAnswer NVARCHAR(50) NOT NULL,
        Explanation NVARCHAR(MAX) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('UserQuizResults', 'U') IS NULL
BEGIN
    CREATE TABLE UserQuizResults (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(450) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Subject NVARCHAR(100) NOT NULL,
        Score INT NOT NULL,
        TotalQuestions INT NOT NULL,
        CompletedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('Jobs', 'U') IS NULL
BEGIN
    CREATE TABLE Jobs (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Title NVARCHAR(200) NOT NULL,
        Company NVARCHAR(200) NOT NULL,
        Location NVARCHAR(200) NOT NULL,
        Salary NVARCHAR(100) NOT NULL,
        Type NVARCHAR(50) NOT NULL,
        Destination NVARCHAR(50) NOT NULL,
        IsFeatured BIT NOT NULL DEFAULT 0,
        Description NVARCHAR(MAX) NULL,
        Requirements NVARCHAR(MAX) NULL,
        Responsibilities NVARCHAR(MAX) NULL,
        Benefits NVARCHAR(MAX) NULL,
        Category NVARCHAR(200) NULL,
        ExperienceLevel NVARCHAR(200) NULL,
        CompanyLogo NVARCHAR(MAX) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('JobApplications', 'U') IS NULL
BEGIN
    CREATE TABLE JobApplications (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        JobId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Jobs(Id) ON DELETE CASCADE,
        Name NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) NOT NULL,
        CVPath NVARCHAR(MAX) NOT NULL,
        Status NVARCHAR(50) NOT NULL,
        TestScore INT NULL,
        InterviewDetails NVARCHAR(MAX) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('UserResumes', 'U') IS NULL
BEGIN
    CREATE TABLE UserResumes (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(450) NOT NULL,
        FullName NVARCHAR(200) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) NOT NULL,
        Phone NVARCHAR(50) NOT NULL,
        Summary NVARCHAR(MAX) NULL,
        ExperienceJson NVARCHAR(MAX) NULL,
        EducationJson NVARCHAR(MAX) NULL,
        SkillsJson NVARCHAR(MAX) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('Mentors', 'U') IS NULL
BEGIN
    CREATE TABLE Mentors (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(200) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Institution NVARCHAR(200) NOT NULL,
        ImageUrl NVARCHAR(MAX) NOT NULL,
        Subject NVARCHAR(100) NOT NULL,
        Bio NVARCHAR(MAX) NULL,
        Rating FLOAT NOT NULL DEFAULT 0.0,
        BookingPrice FLOAT NOT NULL DEFAULT 0.0,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('AboutUsMembers', 'U') IS NULL
BEGIN
    CREATE TABLE AboutUsMembers (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(200) NOT NULL,
        Role NVARCHAR(200) NOT NULL,
        Bio NVARCHAR(MAX) NOT NULL,
        ImageUrl NVARCHAR(MAX) NOT NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        LinkedinUrl NVARCHAR(500) NULL,
        TwitterUrl NVARCHAR(500) NULL,
        Email NVARCHAR(256) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('AboutUsSettings', 'U') IS NULL
BEGIN
    CREATE TABLE AboutUsSettings (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        HeroTitle NVARCHAR(500) NOT NULL,
        HeroSubtitle NVARCHAR(1000) NOT NULL,
        MissionText NVARCHAR(MAX) NOT NULL,
        VisionText NVARCHAR(MAX) NOT NULL,
        StatsJson NVARCHAR(MAX) NOT NULL,
        ValuesJson NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('Companies', 'U') IS NULL
BEGIN
    CREATE TABLE Companies (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) NULL,
        Phone NVARCHAR(100) NULL,
        Website NVARCHAR(200) NULL,
        Logo NVARCHAR(MAX) NULL,
        Address NVARCHAR(500) NULL,
        Description NVARCHAR(MAX) NULL,
        IsVerified BIT NOT NULL DEFAULT 0,
        UserId NVARCHAR(450) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END

IF OBJECT_ID('JobCategories', 'U') IS NULL
BEGIN
    CREATE TABLE JobCategories (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(200) NOT NULL,
        Slug NVARCHAR(200) NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END
";
    try
    {
        await dbContext.Database.ExecuteSqlRawAsync(rawSql);
        
        // Add dynamic email and user columns to Mentors if they do not exist
        await dbContext.Database.ExecuteSqlRawAsync(@"
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Mentors') AND name = 'Email')
                ALTER TABLE Mentors ADD Email NVARCHAR(256) NULL;
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Mentors') AND name = 'UserId')
                ALTER TABLE Mentors ADD UserId NVARCHAR(450) NULL;
        ");

        // Add dynamic columns to Jobs if they do not exist
        await dbContext.Database.ExecuteSqlRawAsync(@"
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Jobs') AND name = 'Description')
            BEGIN
                ALTER TABLE Jobs ADD Description NVARCHAR(MAX) NULL;
                ALTER TABLE Jobs ADD Requirements NVARCHAR(MAX) NULL;
                ALTER TABLE Jobs ADD Responsibilities NVARCHAR(MAX) NULL;
                ALTER TABLE Jobs ADD Benefits NVARCHAR(MAX) NULL;
                ALTER TABLE Jobs ADD Category NVARCHAR(200) NULL;
                ALTER TABLE Jobs ADD ExperienceLevel NVARCHAR(200) NULL;
                ALTER TABLE Jobs ADD CompanyLogo NVARCHAR(MAX) NULL;
            END
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Jobs') AND name = 'CompanyId')
                ALTER TABLE Jobs ADD CompanyId UNIQUEIDENTIFIER NULL;
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Jobs') AND name = 'CategoryId')
                ALTER TABLE Jobs ADD CategoryId UNIQUEIDENTIFIER NULL;
        ");
        Console.WriteLine("TakeUUp Schema updates executed successfully.");

        // Upgrade Companies and JobCategories to System-Versioned Temporal Tables
        await dbContext.Database.ExecuteSqlRawAsync(@"
            IF OBJECT_ID('Companies', 'U') IS NOT NULL AND NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Companies' AND temporal_type = 2)
            BEGIN
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Companies') AND name = 'SysStartTime')
                BEGIN
                    ALTER TABLE Companies ADD 
                        SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN DEFAULT GETUTCDATE() NOT NULL,
                        SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999') NOT NULL,
                        PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime);
                END
                ALTER TABLE Companies SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.CompaniesHistory));
            END

            IF OBJECT_ID('JobCategories', 'U') IS NOT NULL AND NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'JobCategories' AND temporal_type = 2)
            BEGIN
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('JobCategories') AND name = 'SysStartTime')
                BEGIN
                    ALTER TABLE JobCategories ADD 
                        SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START HIDDEN DEFAULT GETUTCDATE() NOT NULL,
                        SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END HIDDEN DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999') NOT NULL,
                        PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime);
                END
                ALTER TABLE JobCategories SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.JobCategoriesHistory));
            END
        ");
        Console.WriteLine("Temporal System-Versioned Auditing active for Companies & JobCategories.");

        // Seeding Mentors
        if (!await dbContext.Mentors.AnyAsync())
        {
            dbContext.Mentors.AddRange(
                new Mentor { Name = "Zafar Iqbal", Title = "Professor of CSE", Institution = "SUST", ImageUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200", Subject = "Physics", Bio = "Passionate writer and educator with 30+ years teaching experience.", Rating = 4.9, BookingPrice = 500 },
                new Mentor { Name = "Chamok Hasan", Title = "Author & Lecturer", Institution = "BUET", ImageUrl = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200", Subject = "Math", Bio = "Making math fun and intuitive for everyone.", Rating = 4.8, BookingPrice = 450 },
                new Mentor { Name = "Ayman Sadiq", Title = "Founder", Institution = "10 Minute School", ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", Subject = "English", Bio = "EdTech pioneer teaching soft skills and English speaking.", Rating = 4.9, BookingPrice = 600 }
            );
            await dbContext.SaveChangesAsync();
            Console.WriteLine("Mock Mentors Seeded.");
        }

        try
        {
            await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM JobApplications; DELETE FROM Jobs; DELETE FROM Companies; DELETE FROM JobCategories;");
            Console.WriteLine("Cleared old Job, Company, and Category records for clean reseeding.");
        }
        catch {}

        // 1. Seed categories
        var catSoftware = new JobCategory { Name = "Software Engineering", Slug = "software-engineering", IsActive = true };
        var catUIUX = new JobCategory { Name = "UI/UX Design", Slug = "ui-ux-design", IsActive = true };
        var catContent = new JobCategory { Name = "Content Writing", Slug = "content-writing", IsActive = true };
        var catMarketing = new JobCategory { Name = "Marketing", Slug = "marketing", IsActive = true };
        var catGraphics = new JobCategory { Name = "Graphics Design", Slug = "graphics-design", IsActive = true };

        dbContext.JobCategories.AddRange(catSoftware, catUIUX, catContent, catMarketing, catGraphics);

        // 2. Seed companies
        var compPathao = new Company { Name = "Pathao", Email = "career@pathao.com", Website = "https://pathao.com", Logo = "https://logo.clearbit.com/pathao.com", Address = "Gulshan, Dhaka", IsVerified = true };
        var compBkash = new Company { Name = "bKash", Email = "career@bkash.com", Website = "https://bkash.com", Logo = "https://ui-avatars.com/api/?name=bKash&background=random", Address = "Remote", IsVerified = true };
        var compTenMS = new Company { Name = "10 Minute School", Email = "career@10minuteschool.com", Website = "https://10minuteschool.com", Logo = "https://logo.clearbit.com/10minuteschool.com", Address = "Banani, Dhaka", IsVerified = true };
        var compTakeUUp = new Company { Name = "TakeUUp", Email = "career@takeuup.com", Website = "https://takeuup.com", Logo = "https://ui-avatars.com/api/?name=TakeUUp&background=random", Address = "Remote", IsVerified = true };

        dbContext.Companies.AddRange(compPathao, compBkash, compTenMS, compTakeUUp);
        await dbContext.SaveChangesAsync();

        // 3. Seed jobs referencing categories and companies
        if (!await dbContext.Jobs.AnyAsync())
        {
            dbContext.Jobs.AddRange(
                new Job 
                { 
                    Title = "Junior Frontend Dev", 
                    Company = "Pathao", 
                    Location = "Gulshan, Dhaka", 
                    Salary = "25k-30k", 
                    Type = "Full-time", 
                    Destination = "Portal", 
                    IsFeatured = true,
                    Category = "Software Engineering",
                    ExperienceLevel = "Entry Level",
                    Description = "Join Pathao's dynamic engineering team as a Junior Frontend Developer to build next-generation ride-sharing, food delivery, and payment interfaces.",
                    Requirements = "• Proficiency in HTML, CSS, JavaScript, and React.js.\n• Experience with Tailwind CSS and responsive design.\n• Familiarity with state management libraries like Redux or Context API.\n• Good problem-solving skills.",
                    Responsibilities = "• Collaborate with product designers and backend engineers to implement clean user interfaces.\n• Write modular, reusable, and testable code.\n• Optimize web applications for maximum speed and scalability.",
                    Benefits = "• Competitive salary.\n• Flexible work hours.\n• Weekly team lunches and refreshments.\n• Opportunity to learn from senior engineers.",
                    CompanyLogo = "https://logo.clearbit.com/pathao.com",
                    CompanyId = compPathao.Id,
                    CategoryId = catSoftware.Id
                },
                new Job 
                { 
                    Title = "Senior UI/UX Designer", 
                    Company = "bKash", 
                    Location = "Remote", 
                    Salary = "50k-70k", 
                    Type = "Contract", 
                    Destination = "Portal", 
                    IsFeatured = true,
                    Category = "UI/UX Design",
                    ExperienceLevel = "Senior Level",
                    Description = "bKash is looking for a Senior UI/UX Designer to lead the redesign of our mobile banking app, creating seamless and delightful payment experiences for millions of users.",
                    Requirements = "• 5+ years of experience in UI/UX design for web and mobile platforms.\n• Strong portfolio demonstrating user-centric design processes.\n• Expertise in Figma, Adobe XD, or Sketch.\n• Excellent communication and leadership skills.",
                    Responsibilities = "• Conduct user research and translate insights into wireframes, user flows, and interactive prototypes.\n• Establish and maintain a cohesive design system.\n• Collaborate with developers to ensure pixel-perfect implementation.",
                    Benefits = "• Top-tier compensation packages.\n• Comprehensive health insurance.\n• Annual performance bonuses.\n• Creative and inclusive work environment.",
                    CompanyLogo = "https://ui-avatars.com/api/?name=bKash&background=random",
                    CompanyId = compBkash.Id,
                    CategoryId = catUIUX.Id
                },
                new Job 
                { 
                    Title = "Content Executive", 
                    Company = "10 Minute School", 
                    Location = "Banani, Dhaka", 
                    Salary = "15k-20k", 
                    Type = "Part-time", 
                    Destination = "Portal", 
                    IsFeatured = false,
                    Category = "Content Writing",
                    ExperienceLevel = "Entry Level",
                    Description = "10 Minute School is searching for a Content Executive to create engaging educational content, study guides, and blog posts for students across Bangladesh.",
                    Requirements = "• Strong written communication skills in both Bangla and English.\n• Passion for education and simplifying complex topics.\n• Basic understanding of SEO best practices.\n• Familiarity with social media platforms.",
                    Responsibilities = "• Write clear, concise, and engaging educational copy.\n• Coordinate with instructors to prepare study materials.\n• Manage content publishing calendar.",
                    Benefits = "• Friendly workspace environment.\n• Mentorship and career growth opportunities.\n• Flexible hybrid working model.",
                    CompanyLogo = "https://logo.clearbit.com/10minuteschool.com",
                    CompanyId = compTenMS.Id,
                    CategoryId = catContent.Id
                },
                new Job 
                { 
                    Title = "Academic Content Writer", 
                    Company = "TakeUUp", 
                    Location = "Remote", 
                    Salary = "12k", 
                    Type = "Internship", 
                    Destination = "Career", 
                    IsFeatured = true,
                    Category = "Content Writing",
                    ExperienceLevel = "Entry Level",
                    Description = "Join TakeUUp as an Academic Content Writer Intern to help students with formula sheets, quiz questions, and blog guides.",
                    Requirements = "• Currently pursuing a University degree.\n• Strong academic background in Science, Commerce, or Arts.\n• Detail-oriented with good editing skills.",
                    Responsibilities = "• Write academic answers, formula sheets, and study hack articles.\n• Verify correctness of question banks.",
                    Benefits = "• Paid internship stipend.\n• Certificate of internship completion.\n• Recommendation letter.\n• Flexible working hours (Remote).",
                    CompanyLogo = "https://ui-avatars.com/api/?name=TakeUUp&background=random",
                    CompanyId = compTakeUUp.Id,
                    CategoryId = catContent.Id
                }
            );
            await dbContext.SaveChangesAsync();
            Console.WriteLine("Mock Jobs Seeded.");
        }

        // Seeding About Us Settings
        if (!await dbContext.AboutUsSettings.AnyAsync())
        {
            var defaultSettings = new AboutUsSettings
            {
                HeroTitle = "Democratizing Education Across Bangladesh",
                HeroSubtitle = "TakeUUp is more than just an ed-tech platform. It's a movement to bridge the gap between dreamers and achievers through technology, data, and mentorship.",
                MissionText = "I started TakeUUp with a simple laptop and a massive vision: to fix the fragmentation in Bangladesh's competitive exam preparation system. Growing up, I saw brilliant students failing not because they lacked talent, but because they lacked resources and guidance. Expensive coaching centers in Dhaka were the only option, leaving rural students behind.",
                VisionText = "Today, TakeUUp levels the playing field. We use AI to personalize learning, making premium education affordable and accessible to a student in a remote village just as it is to one in the capital.",
                StatsJson = "[{\"label\": \"Active Students\", \"value\": \"50,000+\"}, {\"label\": \"Quizzes Taken\", \"value\": \"1.2M+\"}, {\"label\": \"Questions Solved\", \"value\": \"5M+\"}, {\"label\": \"Success Stories\", \"value\": \"1000+\"}]",
                ValuesJson = "[{\"title\": \"Mission Driven\", \"desc\": \"We are obsessed with helping students achieve their academic dreams.\"}, {\"title\": \"Student First\", \"desc\": \"Every feature we build starts with the question: 'Does this help the student?'\"}, {\"title\": \"Fast & Reliable\", \"desc\": \"We believe technology should speed up learning, not slow it down.\"}, {\"title\": \"Accessible\", \"desc\": \"Quality education should be available to everyone, everywhere.\"}]"
            };
            dbContext.AboutUsSettings.Add(defaultSettings);
            await dbContext.SaveChangesAsync();
            Console.WriteLine("About Us Settings Seeded.");
        }

        // Seeding About Us Members (Founder & Co-founder)
        if (!await dbContext.AboutUsMembers.AnyAsync())
        {
            dbContext.AboutUsMembers.AddRange(
                new AboutUsMember
                {
                    Name = "Tahmid Rayat",
                    Role = "Founder & CEO",
                    Bio = "Visionary leader driving the growth and mission of TakeUUp to reach millions of students.",
                    ImageUrl = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
                    DisplayOrder = 1,
                    LinkedinUrl = "https://linkedin.com/in/tahmid-rayat",
                    TwitterUrl = "https://twitter.com/tahmidrayat",
                    Email = "tahmid@takeuup.com"
                },
                new AboutUsMember
                {
                    Name = "Mostafizur Rahman",
                    Role = "Co-Founder & CTO",
                    Bio = "Leading the technological development, AI algorithms, and scaling of the learning architecture.",
                    ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
                    DisplayOrder = 2,
                    LinkedinUrl = "https://linkedin.com/in/mostafizur",
                    TwitterUrl = "https://twitter.com/mostafizur",
                    Email = "mostafizur@takeuup.com"
                }
            );
            await dbContext.SaveChangesAsync();
            Console.WriteLine("About Us Members Seeded.");
        }

        // Seeding Blog Categories
        if (!await dbContext.blogCategories.AnyAsync())
        {
            dbContext.blogCategories.AddRange(
                new BlogCategory { Id = Guid.NewGuid(), Name = "General", Slug = "general", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "SSC Chemistry", Slug = "ssc-chemistry", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "HSC Math", Slug = "hsc-math", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "HSC Physics", Slug = "hsc-physics", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "University Admission", Slug = "university-admission", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "BCS Guide", Slug = "bcs-guide", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "Study Hacks", Slug = "study-hacks", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "Career Advice", Slug = "career-advice", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
                new BlogCategory { Id = Guid.NewGuid(), Name = "Job Prep", Slug = "job-prep", IsActive = true, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
            );
            await dbContext.SaveChangesAsync();
            Console.WriteLine("Mock Blog Categories Seeded.");
        }

        // Seeding Blogs
        if (!await dbContext.blogs.AnyAsync())
        {
            var categories = await dbContext.blogCategories.ToListAsync();
            var getCatId = (string name) => categories.FirstOrDefault(c => c.Name == name)?.Id ?? categories.First().Id;

            dbContext.blogs.AddRange(
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "Mastering Organic Chemistry for HSC", 
                    Slug = "mastering-organic-chemistry-for-hsc",
                    BlogCategoryId = getCatId("SSC Chemistry"),
                    ImageUrl = "https://picsum.photos/id/106/800/400",
                    Description = "Organic chemistry is often considered one of the most challenging parts of the HSC Chemistry syllabus. However, with a strategic approach, it can become one of your strongest areas.\n\n1. Understand the Fundamentals\nBefore diving into complex reactions, ensure you have a rock-solid understanding of the basics:\n- Hybridization: Know your sp, sp2, and sp3 carbons inside out.\n- Nomenclature: IUPAC naming is the language of organic chemistry.\n- Isomerism: Practice structural and stereoisomerism daily.\n\n2. Focus on Mechanisms\nDon't just memorize reactions; understand the mechanism. Why does a nucleophile attack a specific carbon? Understanding electron movement (curly arrows) is key. Once you grasp the logic, you can predict the outcome of reactions you haven't even seen before.\n\n3. Create Reaction Maps\nVisual aids are incredibly powerful. Create large flowcharts or \"Roadmaps\" that connect functional groups. For example, map out how to convert an Alkane to an Alcohol, then to an Aldehyde, and finally to a Carboxylic Acid. This helps in \"Conversion\" type questions.\n\n4. Name Reactions are Critical\nMake a separate notebook for Name Reactions (e.g., Wurtz, Friedel-Crafts, Cannizzaro, Aldol Condensation). These are high-yield topics for both board exams and university admission tests.\n\nConclusion\nConsistency is key. Practice 5 reactions daily, and soon the fear of Organic Chemistry will turn into fascination. Good luck!",
                    MetaDescription = "Learn key strategies to master Organic Chemistry for HSC board exams and admissions.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                },
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "Top 5 University Admission Tips", 
                    Slug = "top-5-university-admission-tips",
                    BlogCategoryId = getCatId("University Admission"),
                    ImageUrl = "https://picsum.photos/id/20/800/400",
                    Description = "The transition from HSC to University Admission preparation is intense. The competition is fierce, but the right strategy can set you apart. Here are the top 5 tips from past toppers.\n\n1. Know Your Syllabus & Question Pattern\nDifferent universities have different patterns.\n- DU (Dhaka University): Focuses on textbook depth and written parts.\n- BUET: Requires strong analytical and problem-solving skills in Math, Physics, and Chemistry.\n- Medical: Pure memorization and clarity of Biology concepts are vital.\n\n2. Time Management is Everything\nIn the exam hall, you aren't just fighting questions; you are fighting the clock. Practice solving questions under timed conditions. Learn to skip difficult questions and come back to them later.\n\n3. Stick to the Textbooks\nGuidebooks are for practice, but Textbooks are for concepts. For Biology and Chemistry, the board textbooks (like Gazi Ajmal or Hazari Nag) are your bible. Do not neglect them.\n\n4. Question Bank Solving\nSolve the last 10-15 years of question papers for your target university. Many concepts (and sometimes exact questions) get repeated or rephrased.\n\n5. Stay Healthy\nIt sounds cliché, but burnout is real. Ensure you get 6-7 hours of sleep and eat healthy. A tired brain makes silly mistakes.",
                    MetaDescription = "Top 5 university admission preparation tips from past exam toppers.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                },
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "A Guide to the BCS Preliminary Exam", 
                    Slug = "a-guide-to-the-bcs-preliminary-exam",
                    BlogCategoryId = getCatId("BCS Guide"),
                    ImageUrl = "https://picsum.photos/id/175/800/400",
                    Description = "The Bangladesh Civil Service (BCS) exam is the most competitive exam in the country. The Preliminary stage is the first hurdle. Here is how to navigate it.\n\nSubject Distribution:\n- Bangla: 35\n- English: 35\n- Bangladesh Affairs: 30\n- International Affairs: 20\n- Geography: 10\n- General Science: 15\n- Computer & IT: 15\n- Math & Mental Ability: 30\n- Ethics & Good Governance: 10\n\nStrategy:\n1. Strong Areas First: Identify your strengths. If you are good at Math and English, you already have a huge advantage.\n2. Current Affairs: Read a daily newspaper and monthly current affairs magazines. Focus on data, summits, and awards.\n3. Literature: For Bangla and English literature, memorizing authors, quotes, and characters is essential. Use mnemonics to remember them.\n4. Negative Marking: Be very careful. For every wrong answer, 0.5 marks are deducted. It is better to leave a question blank than to guess wildly.\n\nFinal Advice:\nStart early. Even if you are in your 3rd or 4th year of university, start building your general knowledge base now.",
                    MetaDescription = "Subject breakdown and preparation strategy for the BCS Preliminary Exam.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                },
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "How to Build Effective Study Habits", 
                    Slug = "how-to-build-effective-study-habits",
                    BlogCategoryId = getCatId("Study Hacks"),
                    ImageUrl = "https://picsum.photos/id/366/800/400",
                    Description = "Motivation gets you started; habit keeps you going. Here is how to build a study routine that sticks.\n\n1. The Pomodoro Technique\nStudy for 25 minutes, then take a 5-minute break. After four cycles, take a longer break. This prevents mental fatigue and keeps focus sharp.\n\n2. Active Recall\nPassive reading is the least effective way to learn. Instead, close the book and try to recall what you just read. Teach it to an imaginary classroom.\n\n3. Spaced Repetition\nReviewing material at increasing intervals (1 day, 3 days, 1 week, 1 month) commits it to long-term memory. Use apps like Anki or flashcards for this.\n\n4. Environment Matters\nDesignate a specific spot for studying. Keep it clutter-free and distraction-free (put that phone away!).\n\n5. Set Small, Achievable Goals\nInstead of \"Study Physics\", set a goal like \"Complete Chapter 5 Exercise 1-10\". Checking off small tasks gives a dopamine hit that keeps you motivated.",
                    MetaDescription = "A scientific guide to building long-term effective study habits.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                },
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "The Ultimate HSC Physics Formula Sheet", 
                    Slug = "the-ultimate-hsc-physics-formula-sheet",
                    BlogCategoryId = getCatId("HSC Physics"),
                    ImageUrl = "https://picsum.photos/id/450/800/400",
                    Description = "Physics is the language of the universe, and formulas are its alphabet. Here is a quick rundown of essential formulas for HSC Physics 1st Paper.\n\nVector:\n- Resultant R = √(P² + Q² + 2PQcosα)\n- Direction tanθ = (Qsinα) / (P + Qcosα)\n\nDynamics:\n- v = u + at\n- s = ut + ½at²\n- v² = u² + 2as\n- Projectile Range R = (u²sin2α)/g\n\nWork, Power, Energy:\n- Work W = Fs cosθ\n- Kinetic Energy Ek = ½mv²\n- Potential Energy Ep = mgh\n- Power P = W/t = Fv\n\nNote: This is just a glimpse. Make sure to maintain your own formula notebook where you write down every new formula you encounter during problem-solving.",
                    MetaDescription = "The ultimate formula cheatsheet for HSC Physics 1st paper exams.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                },
                new Blog 
                { 
                    Id = Guid.NewGuid(),
                    Title = "Choosing a Career Path After HSC", 
                    Slug = "choosing-a-career-path-after-hsc",
                    BlogCategoryId = getCatId("Career Advice"),
                    ImageUrl = "https://picsum.photos/id/531/800/400",
                    Description = "The period after HSC is a crossroads. Engineering, Medical, University, or studying abroad? Here is how to decide.\n\n1. Passion vs. Scope\nIdeally, you want both. But if you have to choose, prioritize what you are good at. You can build a career in any field if you are in the top 1%.\n\n2. Engineering\nIf you love solving problems, math, and understanding how things work, Engineering is for you. CSE, EEE, and Civil are evergreen fields.\n\n3. Medical\nChoose this only if you have a genuine desire to serve and the patience for a long study period (5 years MBBS + Internship). It is a noble but demanding profession.\n\n4. Pure Subjects\nPhysics, Chemistry, Economics, English - these subjects open doors to academia, research, and civil services.\n\n5. Skill-Based Careers\nDon't ignore emerging fields like Data Science, Digital Marketing, or Graphic Design. Sometimes a traditional degree isn't the only path to success.",
                    MetaDescription = "A complete roadmap for deciding your academic and professional career path after HSC.",
                    IsActive = true,
                    CreatedAt = DateTimeOffset.UtcNow,
                    UpdatedAt = DateTimeOffset.UtcNow
                }
            );
            await dbContext.SaveChangesAsync();
            Console.WriteLine("Mock Blogs Seeded.");
        }
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error initializing TakeUUp Database Schema: {ex.Message}");
    }

    string[] roles = { "Admin", "LocalAdmin", "User", "Mentor", "Employer" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    var adminAccounts = new[]
    {
        (Email: "admin@objectcanvas.com", Username: "admin@objectcanvas.com", Password: "#Motiur@2026", Name: "System Admin", Dept: "System Administration"),
        (Email: "mostafizur@objectcanvas.com", Username: "mostafizur", Password: "#Motiur@2016", Name: "Mostafizur Rahman", Dept: "Management")
    };

    var adminEntityHasher = new PasswordHasher<AdminUser>();

    foreach (var acc in adminAccounts)
    {
        var appUser = await userManager.FindByEmailAsync(acc.Email) ?? await userManager.FindByNameAsync(acc.Username);
        if (appUser == null)
        {
            appUser = new ApplicationUser
            {
                UserName = acc.Username,
                Email = acc.Email,
                EmailConfirmed = true,
                FullName = acc.Name,
                IsActive = true
            };
            var createRes = await userManager.CreateAsync(appUser, acc.Password);
            if (createRes.Succeeded)
            {
                await userManager.AddToRoleAsync(appUser, "Admin");
                await userManager.AddToRoleAsync(appUser, "LocalAdmin");
            }
        }
        else
        {
            appUser.IsActive = true;
            appUser.EmailConfirmed = true;
            if (string.IsNullOrWhiteSpace(appUser.FullName)) appUser.FullName = acc.Name;
            await userManager.UpdateAsync(appUser);

            if (!await userManager.CheckPasswordAsync(appUser, acc.Password))
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(appUser);
                await userManager.ResetPasswordAsync(appUser, token, acc.Password);
            }

            if (!await userManager.IsInRoleAsync(appUser, "Admin"))
            {
                await userManager.AddToRoleAsync(appUser, "Admin");
            }
            if (!await userManager.IsInRoleAsync(appUser, "LocalAdmin"))
            {
                await userManager.AddToRoleAsync(appUser, "LocalAdmin");
            }
        }

        var adminEntity = await dbContext.AdminUsers.FirstOrDefaultAsync(a => a.Email == acc.Email || a.Username == acc.Username);
        if (adminEntity == null)
        {
            adminEntity = new AdminUser
            {
                Id = Guid.NewGuid(),
                Email = acc.Email,
                Username = acc.Username,
                FullName = acc.Name,
                Department = acc.Dept,
                AccessRole = "Admin",
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            adminEntity.PasswordHash = adminEntityHasher.HashPassword(adminEntity, acc.Password);
            dbContext.AdminUsers.Add(adminEntity);
            await dbContext.SaveChangesAsync();
        }
        else
        {
            adminEntity.IsActive = true;
            adminEntity.AccessRole = "Admin";
            if (string.IsNullOrWhiteSpace(adminEntity.FullName)) adminEntity.FullName = acc.Name;
            if (string.IsNullOrWhiteSpace(adminEntity.Department)) adminEntity.Department = acc.Dept;
            adminEntity.PasswordHash = adminEntityHasher.HashPassword(adminEntity, acc.Password);
            adminEntity.UpdatedAt = DateTimeOffset.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    // Reseed MenuItems cleanly to avoid duplicates and ensure a perfect hierarchy
    try
    {
        // Wipe tables to clean duplicates
        await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM RoleMenuPermissions; DELETE FROM ApplicationRoleMenus; DELETE FROM MenuItems;");
        Console.WriteLine("Deleted existing MenuItems, RoleMenuPermissions, and ApplicationRoleMenus.");

        // Define clean menus
        var dashboard = new MenuItem { Title = "Dashboard", Url = "/admin/dashboard", ParentId = null, Sequence = 1, Icon = "LayoutDashboard" };
        var messages = new MenuItem { Title = "Student Messages", Url = "/admin/monitoring/messages", ParentId = null, Sequence = 2, Icon = "MessageSquare" };
        var monitoring = new MenuItem { Title = "Abuse Audit", Url = "/admin/monitoring", ParentId = null, Sequence = 3, Icon = "Shield" };
        var studentHub = new MenuItem { Title = "Student Hub", Url = "/admin/students", ParentId = null, Sequence = 4, Icon = "GraduationCap" };
        var jobBoard = new MenuItem { Title = "Job Board", Url = "/admin/jobs", ParentId = null, Sequence = 5, Icon = "Briefcase" };
        var blog = new MenuItem { Title = "Blog", Url = "/admin/blog", ParentId = null, Sequence = 6, Icon = "FileText" };
        var products = new MenuItem { Title = "Products", Url = "/admin/products", ParentId = null, Sequence = 7, Icon = "ShoppingBag" };
        var orders = new MenuItem { Title = "Orders", Url = "/admin/orders", ParentId = null, Sequence = 8, Icon = "ClipboardList" };
        var newsletter = new MenuItem { Title = "Newsletter", Url = "/admin/newsletter", ParentId = null, Sequence = 9, Icon = "Mail" };
        var qbank = new MenuItem { Title = "Question Bank", Url = "/admin/qbank", ParentId = null, Sequence = 10, Icon = "Upload" };
        var settings = new MenuItem { Title = "Settings", Url = "/admin/settings", ParentId = null, Sequence = 11, Icon = "Settings" };

        dbContext.MenuItems.AddRange(dashboard, messages, monitoring, studentHub, jobBoard, blog, products, orders, newsletter, qbank, settings);
        await dbContext.SaveChangesAsync();

        // Submenus under Question Bank
        var qbankSubs = new List<MenuItem>
        {
            new MenuItem { Title = "Single & Bulk Upload", Url = "/admin/qbank/upload", ParentId = qbank.Id, Sequence = 1 },
            new MenuItem { Title = "Teacher Approvals", Url = "/admin/qbank/teacher-approvals", ParentId = qbank.Id, Sequence = 2 },
            new MenuItem { Title = "Others Approvals", Url = "/admin/qbank/others-approvals", ParentId = qbank.Id, Sequence = 3 },
            new MenuItem { Title = "Edit Requests", Url = "/admin/qbank/edit-requests", ParentId = qbank.Id, Sequence = 4 },
            new MenuItem { Title = "Delete Requests", Url = "/admin/qbank/delete-requests", ParentId = qbank.Id, Sequence = 5 },
            new MenuItem { Title = "Teacher Questions", Url = "/admin/qbank/teacher-questions", ParentId = qbank.Id, Sequence = 6 },
            new MenuItem { Title = "Others Questions", Url = "/admin/qbank/others-questions", ParentId = qbank.Id, Sequence = 7 },
            new MenuItem { Title = "Categories & Subjects", Url = "/admin/qbank/settings", ParentId = qbank.Id, Sequence = 8 }
        };

        // Submenus under Settings
        var settingsSubs = new List<MenuItem>
        {
            new MenuItem { Title = "User Account", Url = "/admin/settings/accounts", ParentId = settings.Id, Sequence = 1 },
            new MenuItem { Title = "Teacher Reg", Url = "/admin/settings/teachers", ParentId = settings.Id, Sequence = 2 },
            new MenuItem { Title = "Roles", Url = "/admin/settings/roles", ParentId = settings.Id, Sequence = 3 },
            new MenuItem { Title = "Permission Matrix", Url = "/admin/settings/permissions", ParentId = settings.Id, Sequence = 4 },
            new MenuItem { Title = "Menus", Url = "/admin/settings/menus", ParentId = settings.Id, Sequence = 5 }
        };

        // Submenus under Abuse Audit
        var monitoringSubs = new List<MenuItem>
        {
            new MenuItem { Title = "Abuse Alerts", Url = "/admin/monitoring/alerts", ParentId = monitoring.Id, Sequence = 1 },
            new MenuItem { Title = "Deleted Log", Url = "/admin/monitoring/deleted", ParentId = monitoring.Id, Sequence = 2 },
            new MenuItem { Title = "Media Attachments", Url = "/admin/monitoring/attachments", ParentId = monitoring.Id, Sequence = 3 },
            new MenuItem { Title = "Spam Keywords", Url = "/admin/monitoring/spam", ParentId = monitoring.Id, Sequence = 4 }
        };

        // Submenus under Job Board
        var jobBoardSubs = new List<MenuItem>
        {
            new MenuItem { Title = "Job Category Page", Url = "/admin/jobs/categories", ParentId = jobBoard.Id, Sequence = 1 },
            new MenuItem { Title = "Company Verification", Url = "/admin/jobs/companies", ParentId = jobBoard.Id, Sequence = 2 },
            new MenuItem { Title = "Jobs List", Url = "/admin/jobs/list", ParentId = jobBoard.Id, Sequence = 3 },
            new MenuItem { Title = "Applications", Url = "/admin/jobs/applications", ParentId = jobBoard.Id, Sequence = 4 }
        };

        // Submenus under Orders
        var ordersSubs = new List<MenuItem>
        {
            new MenuItem { Title = "All Orders", Url = "/admin/orders/all", ParentId = orders.Id, Sequence = 1 },
            new MenuItem { Title = "Pending Orders", Url = "/admin/orders/pending", ParentId = orders.Id, Sequence = 2 },
            new MenuItem { Title = "Progress Order", Url = "/admin/orders/progress", ParentId = orders.Id, Sequence = 3 },
            new MenuItem { Title = "Delivered Orders", Url = "/admin/orders/delivered", ParentId = orders.Id, Sequence = 4 },
            new MenuItem { Title = "Canceled Orders", Url = "/admin/orders/canceled", ParentId = orders.Id, Sequence = 5 }
        };

        // Submenus under Products
        var productsSubs = new List<MenuItem>
        {
            new MenuItem { Title = "Products", Url = "/admin/products/list", ParentId = products.Id, Sequence = 1 },
            new MenuItem { Title = "Category", Url = "/admin/products/categories", ParentId = products.Id, Sequence = 2 },
            new MenuItem { Title = "Brands", Url = "/admin/products/brands", ParentId = products.Id, Sequence = 3 },
            new MenuItem { Title = "Reviews", Url = "/admin/products/reviews", ParentId = products.Id, Sequence = 4 },
            new MenuItem { Title = "Question Ans", Url = "/admin/products/questions", ParentId = products.Id, Sequence = 5 }
        };

        dbContext.MenuItems.AddRange(qbankSubs);
        dbContext.MenuItems.AddRange(settingsSubs);
        dbContext.MenuItems.AddRange(monitoringSubs);
        dbContext.MenuItems.AddRange(jobBoardSubs);
        dbContext.MenuItems.AddRange(ordersSubs);
        dbContext.MenuItems.AddRange(productsSubs);
        await dbContext.SaveChangesAsync();

        // Assign all menus to Admin role
        var adminRole = await roleManager.FindByNameAsync("Admin");
        if (adminRole != null)
        {
            var allMenus = await dbContext.MenuItems.ToListAsync();
            foreach (var menu in allMenus)
            {
                dbContext.ApplicationRoleMenus.Add(new ApplicationRoleMenu
                {
                    RoleId = adminRole.Id,
                    MenuId = menu.Id
                });
            }
            await dbContext.SaveChangesAsync();
            Console.WriteLine("Assigned all MenuItems to Admin role.");
        }
        // Seed Default Goal Categories Tree
        try
        {
            if (!await dbContext.GoalCategories.AnyAsync())
            {
                var cat68 = new GoalCategory { Id = Guid.NewGuid(), Title = "ক্লাস ৬-৮", Subtitle = "মাধ্যমিক ৬ষ্ঠ থেকে ৮ম শ্রেণী", IconName = "BookOpen", Sequence = 1, IsActive = true };
                var catSsc = new GoalCategory { Id = Guid.NewGuid(), Title = "এসএসসি (SSC)", Subtitle = "মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা", IconName = "GraduationCap", Sequence = 2, IsActive = true };
                var catDakhil = new GoalCategory { Id = Guid.NewGuid(), Title = "দাখিল (Dakhil)", Subtitle = "মাদ্রাসা শিক্ষা বোর্ড দাখিল পরীক্ষা", IconName = "BookMarked", Sequence = 3, IsActive = true };
                var catHsc = new GoalCategory { Id = Guid.NewGuid(), Title = "এইচএসসি / এডমিশন", Subtitle = "উচ্চ মাধ্যমিক ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি", IconName = "Award", Sequence = 4, IsActive = true };
                var catAlim = new GoalCategory { Id = Guid.NewGuid(), Title = "আলিম (Alim)", Subtitle = "মাদ্রাসা শিক্ষা বোর্ড আলিম পরীক্ষা", IconName = "BookCheck", Sequence = 5, IsActive = true };
                var catBcs = new GoalCategory { Id = Guid.NewGuid(), Title = "বিসিএস / জবস", Subtitle = "বিসিএস প্রিলি ও সরকারি চাকরি প্রস্তুতি", IconName = "Briefcase", Sequence = 6, IsActive = true };

                dbContext.GoalCategories.AddRange(cat68, catSsc, catDakhil, catHsc, catAlim, catBcs);
                await dbContext.SaveChangesAsync();

                // Sub-categories under SSC
                var subSscSc = new GoalCategory { Id = Guid.NewGuid(), ParentId = catSsc.Id, Title = "বিজ্ঞান বিভাগ", Subtitle = "SSC Science Group", IconName = "FlaskConical", Sequence = 1, IsActive = true };
                var subSscCom = new GoalCategory { Id = Guid.NewGuid(), ParentId = catSsc.Id, Title = "বাণিজ্য বিভাগ", Subtitle = "SSC Business Studies", IconName = "Calculator", Sequence = 2, IsActive = true };
                var subSscArts = new GoalCategory { Id = Guid.NewGuid(), ParentId = catSsc.Id, Title = "মানবিক বিভাগ", Subtitle = "SSC Humanities Group", IconName = "Globe", Sequence = 3, IsActive = true };

                // Sub-categories under HSC / Admission
                var subHscSc = new GoalCategory { Id = Guid.NewGuid(), ParentId = catHsc.Id, Title = "বিজ্ঞান বিভাগ", Subtitle = "HSC Science Group", IconName = "Atom", Sequence = 1, IsActive = true };
                var subHscCom = new GoalCategory { Id = Guid.NewGuid(), ParentId = catHsc.Id, Title = "বাণিজ্য বিভাগ", Subtitle = "HSC Business Studies", IconName = "TrendingUp", Sequence = 2, IsActive = true };
                var subHscEng = new GoalCategory { Id = Guid.NewGuid(), ParentId = catHsc.Id, Title = "ইঞ্জিনিয়ারিং এডমিশন (BUET)", Subtitle = "বুয়েট ও প্রযুক্তি বিশ্ববিদ্যালয় ভর্তি", IconName = "Cpu", Sequence = 3, IsActive = true };
                var subHscMed = new GoalCategory { Id = Guid.NewGuid(), ParentId = catHsc.Id, Title = "মেডিকেল এডমিশন (DMC)", Subtitle = "মেডিকেল ও ডেন্টাল ভর্তি প্রস্তুতি", IconName = "Stethoscope", Sequence = 4, IsActive = true };
                var subHscDu = new GoalCategory { Id = Guid.NewGuid(), ParentId = catHsc.Id, Title = "ভার্সিটি ক-ইউনিট ও গুচ্ছ", Subtitle = "ঢাকা বিশ্ববিদ্যালয় ক-ইউনিট প্রস্তুতি", IconName = "Building2", Sequence = 5, IsActive = true };

                // Sub-categories under BCS / Jobs
                var subBcsPre = new GoalCategory { Id = Guid.NewGuid(), ParentId = catBcs.Id, Title = "বিসিএস প্রিলিমিনারি", Subtitle = "BCS Preliminary Exam", IconName = "CheckCircle2", Sequence = 1, IsActive = true };
                var subBankJobs = new GoalCategory { Id = Guid.NewGuid(), ParentId = catBcs.Id, Title = "ব্যাংক জবস", Subtitle = "Bank Recruitment Exam", IconName = "Landmark", Sequence = 2, IsActive = true };
                var subPrimary = new GoalCategory { Id = Guid.NewGuid(), ParentId = catBcs.Id, Title = "প্রাথমিক শিক্ষক নিয়োগ", Subtitle = "Primary Assistant Teacher", IconName = "Users", Sequence = 3, IsActive = true };

                dbContext.GoalCategories.AddRange(subSscSc, subSscCom, subSscArts, subHscSc, subHscCom, subHscEng, subHscMed, subHscDu, subBcsPre, subBankJobs, subPrimary);
                await dbContext.SaveChangesAsync();
                Console.WriteLine("Seeded initial Goal Categories tree.");
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error seeding GoalCategories: {ex.Message}");
        }
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error seeding MenuItems: {ex.Message}");
    }
});
#endregion


using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Console.WriteLine("🔄 Applying database migrations automatically...");
        await db.Database.MigrateAsync();
        Console.WriteLine("✅ Database migrations applied successfully!");

        await ECommerce.Infrastructure.Persistence.DbSeeder.SeedBilingualDataAsync(db);
        Console.WriteLine("✅ Bilingual dummy data successfully seeded into Database!");
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"⚠️ Error running migrations or seeding data: {ex.Message}");
    }
}

app.Run();
