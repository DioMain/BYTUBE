using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Models
{
    public class PlaylistModel
    {
        public class PlaylistItemModel
        {
            public string PlaylistId { get; set; }

            public string VideoId { get; set; }

            public int? Order {  get; set; }
        }


        public string? Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public Playlist.AccessType Access { get; set; } = Playlist.AccessType.Public;

        public string? UserId { get; set; }

        public List<PlaylistItemModel>? PlaylistItems { get; set; }
    }
}
