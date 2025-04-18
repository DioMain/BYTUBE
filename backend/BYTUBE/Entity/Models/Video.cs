using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Video
    {
        #region Enums
        public enum Access
        {
            All, LinkOnly, Private
        }

        public enum Status
        {
            NoLimit, Limited, Blocked
        }
        #endregion

        [Key]
        public Guid Id { get; set; }

        public required string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required]
        public string Duration { get; set; } = string.Empty;

        public bool ForAdults { get; set; } = false;

        [Column(TypeName = "jsonb")]
        public List<string> Tags { get; set; } = [];

        public required DateTime Created {  get; set; }

        public required Access VideoAccess { get; set; } = Access.All;
        public required Status VideoStatus { get; set; } = Status.NoLimit;

        [Required]
        public required Guid ChannelId { get; set; }

        [ForeignKey(nameof(ChannelId))]
        public Channel? Channel { get; set; }

        public List<Report> Reports { get; set; } = [];

        public List<Comment> Comments { get; set; } = [];

        public List<PlaylistItem> PlaylistItems { get; set; } = [];

        public List<VideoMark> Marks { get; set; } = [];

        public List<VideoView> Views { get; set; } = [];
    }
}
