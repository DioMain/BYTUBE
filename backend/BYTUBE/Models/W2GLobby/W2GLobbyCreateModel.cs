using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.W2GLobby;

public class W2GLobbyCreateModel
{
    [Required(ErrorMessage = "Название лобби должно быть указано!")]
    public string Name { get; set; }

    public string? Password { get; set; }
}
