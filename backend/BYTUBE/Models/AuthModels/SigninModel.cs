using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.AuthModels
{
    public class SigninModel
    {
        [Required(ErrorMessage = "Почта не указана")]
        [EmailAddress(ErrorMessage = "Почта имеет не верный формат")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Пароль не указан")]
        public string Password { get; set; }
    }
}
