using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BYTUBE.Migrations
{
    /// <inheritdoc />
    public partial class AddedDislikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDisLike",
                table: "VideoMarks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("7dc1efc5-688a-499f-8638-0caaf0539616"),
                column: "Created",
                value: new DateTime(2025, 4, 18, 23, 56, 27, 898, DateTimeKind.Utc).AddTicks(7308));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDisLike",
                table: "VideoMarks");

            migrationBuilder.UpdateData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("7dc1efc5-688a-499f-8638-0caaf0539616"),
                column: "Created",
                value: new DateTime(2025, 4, 18, 23, 54, 43, 803, DateTimeKind.Utc).AddTicks(4405));
        }
    }
}
