using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddorderAddressUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderAddress_Orders_OrderId",
                table: "OrderAddress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderAddress",
                table: "OrderAddress");

            migrationBuilder.RenameTable(
                name: "OrderAddress",
                newName: "orderAddresses");

            migrationBuilder.RenameIndex(
                name: "IX_OrderAddress_OrderId",
                table: "orderAddresses",
                newName: "IX_orderAddresses_OrderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_orderAddresses",
                table: "orderAddresses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_orderAddresses_Orders_OrderId",
                table: "orderAddresses",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orderAddresses_Orders_OrderId",
                table: "orderAddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_orderAddresses",
                table: "orderAddresses");

            migrationBuilder.RenameTable(
                name: "orderAddresses",
                newName: "OrderAddress");

            migrationBuilder.RenameIndex(
                name: "IX_orderAddresses_OrderId",
                table: "OrderAddress",
                newName: "IX_OrderAddress_OrderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderAddress",
                table: "OrderAddress",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderAddress_Orders_OrderId",
                table: "OrderAddress",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
