using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class VideoMark
    {
        [Key]
        public Guid Id { get; set; }

        public required Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public required Guid VideoId { get; set; }
        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }

        public bool IsLike { get; set; } = false;
        public bool IsDisLike { get; set; } = false;

        public DateTime Updated { get; set; }
    }
}
