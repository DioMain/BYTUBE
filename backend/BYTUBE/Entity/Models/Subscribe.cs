using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Subscribe
    {
        [Key]
        public Guid Id { get; set; }

        public required Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public required Guid ChannelId { get; set; }
        [ForeignKey(nameof(ChannelId))]
        public Channel? Channel { get; set; }
    }
}
