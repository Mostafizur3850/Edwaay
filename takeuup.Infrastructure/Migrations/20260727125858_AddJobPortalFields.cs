using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddJobPortalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Already applied via Program.cs startup SQL blocks
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutUsMembers");

            migrationBuilder.DropTable(
                name: "AboutUsSettings");

            migrationBuilder.DropTable(
                name: "JobApplications");

            migrationBuilder.DropTable(
                name: "Mentors");

            migrationBuilder.DropTable(
                name: "OtpVerifications");

            migrationBuilder.DropTable(
                name: "ProductPriceRequests",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "QuizSubjects");

            migrationBuilder.DropTable(
                name: "TeacherInvitations");

            migrationBuilder.DropTable(
                name: "UserQuizResults");

            migrationBuilder.DropTable(
                name: "UserResumes");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "QuizCategories");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "GoalProgressJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "Institution",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "IsProfileCompleted",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "IsTeacherApproved",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "MistakesJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "Qualification",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "RoutineTasksJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "SelectedSubjectsJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "Streak",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "StudentClass",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "TargetGoalsJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "UnlockedGoalsJson",
                table: "userProfiles");

            migrationBuilder.DropColumn(
                name: "PriceStatus",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "BkashAppKey",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "BkashAppSecret",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "BkashIsEnabled",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "BkashPassword",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "BkashSandboxUrl",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "BkashUsername",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "PricingPlansJson",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmsApiKey",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmsCallerId",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmsIsEnabled",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmsSecretKey",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmsUseMasking",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmtpEmail",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmtpHost",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmtpIsEnabled",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmtpPassword",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SmtpPort",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SslIsEnabled",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SslSandboxUrl",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SslStoreId",
                table: "generalSettings");

            migrationBuilder.DropColumn(
                name: "SslStorePassword",
                table: "generalSettings");
        }
    }
}
