using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Channel
    {
        [Key]
        public Guid Id { get; set; }

        public required string Name { get; set; }
        public string? Description { get; set; }

        public required DateTime Created {  get; set; }

        public required Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? Owner { get; set; }

        public List<Video> Videos { get; set; } = [];

        public List<Subscribe> Subscribes { get; set; } = [];
    }
}
