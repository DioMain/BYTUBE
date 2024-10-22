using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models
{
    public class RegisterModel
    {
        [Required]
        public string UserName {  get; set; }

        [EmailAddress(ErrorMessage = "Почта не верная")]
        [Required]
        public string Email {  get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
