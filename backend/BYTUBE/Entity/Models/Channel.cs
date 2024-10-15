using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Channel
    {
        [Key]
        public int Id { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime Created {  get; set; }

        [Required]
        public User Owner { get; set; }
    }
}
