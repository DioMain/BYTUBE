using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BYTUBE.Migrations
{
    /// <inheritdoc />
    public partial class addOrderToPLItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "PlaylistItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "PlaylistItems");
        }
    }
}
