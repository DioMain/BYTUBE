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
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public AccessType Access { get; set; } = AccessType.Public;

        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public List<PlaylistItem> PlaylistItems { get; set; } = [];
    }
}
