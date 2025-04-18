using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; }

        public required string Message { get; set; }

        [Column(TypeName = "jsonb")]
        public List<Guid> Likes { get; set; } = [];

        public required DateTime Created { get; set; }

        public required Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public required Guid VideoId { get; set; }
        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }
    }
}
