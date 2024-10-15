using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Video
    {
        [Serializable]
        public class UserIds
        {
            public List<int> Ids = [];
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        public UserIds Likes { get; set; } = new UserIds();

        [Column(TypeName = "jsonb")]
        public UserIds Dislikes { get; set; } = new UserIds();

        public DateTime Created {  get; set; } = DateTime.Now;

        [Required]
        public int OwnerId { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public Channel Owner { get; set; } = new();

        public List<Report> Reports { get; set; } = [];

        public List<Comment> Comments { get; set; } = [];

        public List<PlaylistItem> PlaylistItems { get; set; } = [];
    }
}
