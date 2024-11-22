using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Report
    {      
        public enum ReportType
        {
            SexyalContent = 0, GoreContent, InsultContent, BullyOrAbuse, LieInCriticalInfomation,
            GoreWithChildren, Terrorism, SpamOrLie, NatinalLawBreaking, 
            
            
            Other = 99
        }

        [Key]
        public int Id { get; set; }

        public string? Description { get; set; } = string.Empty;

        [Column(TypeName = "int"), Required]
        public ReportType Type { get; set; }

        [Required]
        public DateTime Created { get; set; } = DateTime.Now.ToUniversalTime();

        public int VideoId { get; set; }

        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }
    }
}
