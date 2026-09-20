using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProductMetaKeywordAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductTag_Products_ProductId",
                table: "ProductTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductTag",
                table: "ProductTag");

            migrationBuilder.DropColumn(
                name: "MetaKeywords",
                table: "Products");

            migrationBuilder.RenameTable(
                name: "ProductTag",
                newName: "productTags");

            migrationBuilder.RenameIndex(
                name: "IX_ProductTag_ProductId",
                table: "productTags",
                newName: "IX_productTags_ProductId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_productTags",
                table: "productTags",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "productMetaKeywords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Keyword = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productMetaKeywords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_productMetaKeywords_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_productMetaKeywords_ProductId",
                table: "productMetaKeywords",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_productTags_Products_ProductId",
                table: "productTags",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_productTags_Products_ProductId",
                table: "productTags");

            migrationBuilder.DropTable(
                name: "productMetaKeywords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_productTags",
                table: "productTags");

            migrationBuilder.RenameTable(
                name: "productTags",
                newName: "ProductTag");

            migrationBuilder.RenameIndex(
                name: "IX_productTags_ProductId",
                table: "ProductTag",
                newName: "IX_ProductTag_ProductId");

            migrationBuilder.AddColumn<string>(
                name: "MetaKeywords",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductTag",
                table: "ProductTag",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductTag_Products_ProductId",
                table: "ProductTag",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
