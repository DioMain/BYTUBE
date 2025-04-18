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
        public Guid Id { get; set; }

        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        public DateOnly BirthDay { get; set; }

        public required RoleType Role { get; set; }

        public string? Token { get; set; }

        public List<Channel> Channels { get; set; } = [];

        public List<Subscribe> Subscribes { get; set; } = [];

        public List<Playlist> Playlists { get; set; } = [];

        public List<Comment> Comments { get; set; } = [];

        public List<VideoMark> VideoMarks { get; set; } = [];
    }
}
