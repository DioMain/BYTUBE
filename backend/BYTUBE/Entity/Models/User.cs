using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class User
    {
        public enum RoleType
        {
            User, Admin
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public RoleType Role { get; set; } = RoleType.User;

        public string? Token { get; set; }

        public List<Channel> Channels { get; set; } = [];

        public List<Subscribe> Subscribes { get; set; } = [];

        public List<Playlist> Playlists { get; set; } = [];

        public List<Comment> Comments { get; set; } = [];
    }
}
