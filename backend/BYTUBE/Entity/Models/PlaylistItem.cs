using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class PlaylistItem
    {
        [Key]
        public int Id { get; set; }

        public int PlaylistId { get; set; }
        [ForeignKey(nameof(PlaylistId))]
        public Playlist? Playlist { get; set; }

        public int VideoId { get; set; }
        [ForeignKey(nameof(VideoId))]
        public Video? Video { get; set; }

        [Required]
        public int Order {  get; set; }
    }
}
