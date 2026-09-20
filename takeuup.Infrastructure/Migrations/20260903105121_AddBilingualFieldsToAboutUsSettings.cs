using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBilingualFieldsToAboutUsSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroSubtitleBn",
                table: "AboutUsSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroSubtitleEn",
                table: "AboutUsSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroTitleBn",
                table: "AboutUsSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroTitleEn",
                table: "AboutUsSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroSubtitleBn",
                table: "AboutUsSettings");

            migrationBuilder.DropColumn(
                name: "HeroSubtitleEn",
                table: "AboutUsSettings");

            migrationBuilder.DropColumn(
                name: "HeroTitleBn",
                table: "AboutUsSettings");

            migrationBuilder.DropColumn(
                name: "HeroTitleEn",
                table: "AboutUsSettings");
        }
    }
}
