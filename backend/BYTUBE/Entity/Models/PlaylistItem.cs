using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class PlaylistItem
    {
        [Key]
        public Guid Id { get; set; }

        public required Guid PlaylistId { get; set; }
        [ForeignKey(nameof(PlaylistId))]
        public Playlist? Playlist { get; set; }

        public required Guid VideoId { get; set; }
        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }

        public required int Order {  get; set; }
    }
}
