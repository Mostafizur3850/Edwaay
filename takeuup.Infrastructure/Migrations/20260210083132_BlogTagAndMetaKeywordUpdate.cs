using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BlogTagAndMetaKeywordUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogMetaKeyword_blogs_BlogId",
                table: "BlogMetaKeyword");

            migrationBuilder.DropForeignKey(
                name: "FK_BlogTag_blogs_BlogId",
                table: "BlogTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BlogTag",
                table: "BlogTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BlogMetaKeyword",
                table: "BlogMetaKeyword");

            migrationBuilder.RenameTable(
                name: "BlogTag",
                newName: "blogTags");

            migrationBuilder.RenameTable(
                name: "BlogMetaKeyword",
                newName: "blogMetaKeywords");

            migrationBuilder.RenameIndex(
                name: "IX_BlogTag_BlogId",
                table: "blogTags",
                newName: "IX_blogTags_BlogId");

            migrationBuilder.RenameIndex(
                name: "IX_BlogMetaKeyword_BlogId",
                table: "blogMetaKeywords",
                newName: "IX_blogMetaKeywords_BlogId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_blogTags",
                table: "blogTags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_blogMetaKeywords",
                table: "blogMetaKeywords",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_blogMetaKeywords_blogs_BlogId",
                table: "blogMetaKeywords",
                column: "BlogId",
                principalTable: "blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_blogTags_blogs_BlogId",
                table: "blogTags",
                column: "BlogId",
                principalTable: "blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_blogMetaKeywords_blogs_BlogId",
                table: "blogMetaKeywords");

            migrationBuilder.DropForeignKey(
                name: "FK_blogTags_blogs_BlogId",
                table: "blogTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_blogTags",
                table: "blogTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_blogMetaKeywords",
                table: "blogMetaKeywords");

            migrationBuilder.RenameTable(
                name: "blogTags",
                newName: "BlogTag");

            migrationBuilder.RenameTable(
                name: "blogMetaKeywords",
                newName: "BlogMetaKeyword");

            migrationBuilder.RenameIndex(
                name: "IX_blogTags_BlogId",
                table: "BlogTag",
                newName: "IX_BlogTag_BlogId");

            migrationBuilder.RenameIndex(
                name: "IX_blogMetaKeywords_BlogId",
                table: "BlogMetaKeyword",
                newName: "IX_BlogMetaKeyword_BlogId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlogTag",
                table: "BlogTag",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlogMetaKeyword",
                table: "BlogMetaKeyword",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BlogMetaKeyword_blogs_BlogId",
                table: "BlogMetaKeyword",
                column: "BlogId",
                principalTable: "blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BlogTag_blogs_BlogId",
                table: "BlogTag",
                column: "BlogId",
                principalTable: "blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
