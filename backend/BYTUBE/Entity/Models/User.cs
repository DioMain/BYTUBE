using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Entity.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        public string Role { get; set; } = "User";

        public string? Token { get; set; }

        public List<Channel> Channels { get; set; } = new();
    }
}
