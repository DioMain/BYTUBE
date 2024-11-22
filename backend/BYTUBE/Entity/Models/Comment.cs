using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        public List<int> Likes { get; set; } = [];

        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public int VideoId { get; set; }
        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }
    }
}
