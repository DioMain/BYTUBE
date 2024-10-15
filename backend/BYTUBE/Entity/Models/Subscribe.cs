using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Subscribe
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public int ChannelId { get; set; }
        [ForeignKey(nameof(ChannelId))]
        public Channel? Channel { get; set; }
    }
}
