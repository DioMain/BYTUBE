using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Playlist
    {
        public enum AccessType
        {
            Public, Private
        }

        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Column(TypeName = "int")]
        public required AccessType Access { get; set; }

        public required Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public List<PlaylistItem> PlaylistItems { get; set; } = [];
    }
}
