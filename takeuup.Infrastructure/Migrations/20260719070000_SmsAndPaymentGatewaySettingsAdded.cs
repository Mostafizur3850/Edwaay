using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [Microsoft.EntityFrameworkCore.Infrastructure.DbContext(typeof(AppDbContext))]
    [Microsoft.EntityFrameworkCore.Migrations.Migration("20260719070000_SmsAndPaymentGatewaySettingsAdded")]
    public partial class SmsAndPaymentGatewaySettingsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Create OtpVerifications Table
            migrationBuilder.CreateTable(
                name: "OtpVerifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Identifier = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExpiryTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false, defaultValueSql: "SYSDATETIMEOFFSET()"),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false, defaultValueSql: "SYSDATETIMEOFFSET()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpVerifications", x => x.Id);
                });

            // 2. Add columns to generalSettings table
            migrationBuilder.AddColumn<string>(name: "SmsApiKey", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "SmsSecretKey", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "SmsCallerId", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<bool>(name: "SmsIsEnabled", table: "generalSettings", type: "bit", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "SmsUseMasking", table: "generalSettings", type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<string>(name: "SslStoreId", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "SslStorePassword", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "SslSandboxUrl", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<bool>(name: "SslIsEnabled", table: "generalSettings", type: "bit", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<string>(name: "BkashAppKey", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "BkashAppSecret", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "BkashUsername", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "BkashPassword", table: "generalSettings", type: "nvarchar(100)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "BkashSandboxUrl", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<bool>(name: "BkashIsEnabled", table: "generalSettings", type: "bit", nullable: false, defaultValue: false);

            // SMTP Columns
            migrationBuilder.AddColumn<string>(name: "SmtpHost", table: "generalSettings", type: "nvarchar(256)", nullable: true, defaultValue: "smtp.gmail.com");
            migrationBuilder.AddColumn<int>(name: "SmtpPort", table: "generalSettings", type: "int", nullable: false, defaultValue: 587);
            migrationBuilder.AddColumn<string>(name: "SmtpEmail", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<string>(name: "SmtpPassword", table: "generalSettings", type: "nvarchar(256)", nullable: true);
            migrationBuilder.AddColumn<bool>(name: "SmtpIsEnabled", table: "generalSettings", type: "bit", nullable: false, defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "OtpVerifications");

            migrationBuilder.DropColumn(name: "SmsApiKey", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmsSecretKey", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmsCallerId", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmsIsEnabled", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmsUseMasking", table: "generalSettings");

            migrationBuilder.DropColumn(name: "SslStoreId", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SslStorePassword", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SslSandboxUrl", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SslIsEnabled", table: "generalSettings");

            migrationBuilder.DropColumn(name: "BkashAppKey", table: "generalSettings");
            migrationBuilder.DropColumn(name: "BkashAppSecret", table: "generalSettings");
            migrationBuilder.DropColumn(name: "BkashUsername", table: "generalSettings");
            migrationBuilder.DropColumn(name: "BkashPassword", table: "generalSettings");
            migrationBuilder.DropColumn(name: "BkashSandboxUrl", table: "generalSettings");
            migrationBuilder.DropColumn(name: "BkashIsEnabled", table: "generalSettings");

            // SMTP Columns
            migrationBuilder.DropColumn(name: "SmtpHost", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmtpPort", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmtpEmail", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmtpPassword", table: "generalSettings");
            migrationBuilder.DropColumn(name: "SmtpIsEnabled", table: "generalSettings");
        }
    }
}
