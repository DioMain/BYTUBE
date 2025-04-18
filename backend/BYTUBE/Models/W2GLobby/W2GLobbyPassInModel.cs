using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.W2GLobby;

public class W2GLobbyPassInModel
{
    [Required(ErrorMessage = "Название лобби должно быть указано!")]
    public string Name { get; set; }
    [Required(ErrorMessage = "Пароль должен быть указан!")]
    public string Password { get; set; }
}
