using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models
{
    public class ReportModel
    {
        public string? Id { get; set; }

        public string? Description { get; set; } = string.Empty;

        [Required]
        public Report.ReportType Type { get; set; }

        public string VideoGuid { get; set; }

        public DateTime? Created { get; set; }
    }
}
