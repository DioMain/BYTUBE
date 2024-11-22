using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Models
{
    public class PlaylistModel
    {
        public class PlaylistItemModel
        {
            public int PlaylistId { get; set; }

            public int VideoId { get; set; }
        }


        public int? Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public Playlist.AccessType Access { get; set; } = Playlist.AccessType.Public;

        public int? UserId { get; set; }

        public List<PlaylistItemModel>? PlaylistItems { get; set; }
    }
}
