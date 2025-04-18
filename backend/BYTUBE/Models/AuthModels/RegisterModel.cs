using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.AuthModels
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Укажите ваше имя")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя дожно состоять от 3 - 50 символов")]
        public string UserName {  get; set; }

        [EmailAddress(ErrorMessage = "Почта не верная")]
        [Required(ErrorMessage = "Укажите вашу почту")]
        public string Email {  get; set; }

        [Required(ErrorMessage = "Укажите ваш пароль")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть не кароче 6-ти символов")]
        [DataType(DataType.Password, ErrorMessage = "Пароль не верный")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Нужно повтарить пароль")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Требуеться дата рождения")]
        [DataType(DataType.Date, ErrorMessage = "Это не дата!")]
        public string BirthDay { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
