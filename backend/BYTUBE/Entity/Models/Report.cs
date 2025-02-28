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
        public Guid Id { get; set; }

        public string? Description { get; set; }

        [Column(TypeName = "int"), Required]
        public ReportType Type { get; set; }

        public required DateTime Created { get; set; }

        public required Guid VideoId { get; set; }

        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }
    }
}
