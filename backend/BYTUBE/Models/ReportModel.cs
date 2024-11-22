using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models
{
    public class ReportModel
    {
        public int? Id { get; set; }

        public string? Description { get; set; } = string.Empty;

        [Required]
        public Report.ReportType Type { get; set; }

        public int VideoId { get; set; }

        public DateTime? Created { get; set; }
    }
}
