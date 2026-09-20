using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class GeneralSettingRelatedTableAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "generalSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HomePageTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryColorCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrencyDirection = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DecimalSeparator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThousandSeparator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SiteMetaDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_generalSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "contactSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StoreAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StorePhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StoreEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GatewayImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CopyrightText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneralSettingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contactSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_contactSettings_generalSettings_GeneralSettingId",
                        column: x => x.GeneralSettingId,
                        principalTable: "generalSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "mediaSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LogoPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneralSettingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mediaSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mediaSettings_generalSettings_GeneralSettingId",
                        column: x => x.GeneralSettingId,
                        principalTable: "generalSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "siteMetaKeywords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Keyword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneralSettingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_siteMetaKeywords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_siteMetaKeywords_generalSettings_GeneralSettingId",
                        column: x => x.GeneralSettingId,
                        principalTable: "generalSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "socialLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IconName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactSettingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_socialLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_socialLinks_contactSettings_ContactSettingId",
                        column: x => x.ContactSettingId,
                        principalTable: "contactSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "workingHours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DayType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FromTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ToTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ContactSettingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workingHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workingHours_contactSettings_ContactSettingId",
                        column: x => x.ContactSettingId,
                        principalTable: "contactSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_contactSettings_GeneralSettingId",
                table: "contactSettings",
                column: "GeneralSettingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_mediaSettings_GeneralSettingId",
                table: "mediaSettings",
                column: "GeneralSettingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_siteMetaKeywords_GeneralSettingId",
                table: "siteMetaKeywords",
                column: "GeneralSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_socialLinks_ContactSettingId",
                table: "socialLinks",
                column: "ContactSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_workingHours_ContactSettingId",
                table: "workingHours",
                column: "ContactSettingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mediaSettings");

            migrationBuilder.DropTable(
                name: "siteMetaKeywords");

            migrationBuilder.DropTable(
                name: "socialLinks");

            migrationBuilder.DropTable(
                name: "workingHours");

            migrationBuilder.DropTable(
                name: "contactSettings");

            migrationBuilder.DropTable(
                name: "generalSettings");
        }
    }
}
