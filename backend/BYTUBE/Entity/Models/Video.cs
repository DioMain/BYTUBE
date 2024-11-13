using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Video
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public int Views { get; set; } = 0;

        [Required]
        public string Duration { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        public List<string> Tags { get; set; } = [];

        [Column(TypeName = "jsonb")]
        public List<int> Likes { get; set; } = [];

        [Column(TypeName = "jsonb")]
        public List<int> Dislikes { get; set; } = [];

        public DateTime Created {  get; set; } = DateTime.Now.ToUniversalTime();

        [Required]
        public int OwnerId { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public Channel? Owner { get; set; }

        public List<Report> Reports { get; set; } = [];

        public List<Comment> Comments { get; set; } = [];

        public List<PlaylistItem> PlaylistItems { get; set; } = [];
    }
}
