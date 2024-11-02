using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.ChannelModels
{
    public class CreateChannelModel
    {
        [Required(ErrorMessage = "Имя должно быть")]
        [Length(3, 32, ErrorMessage = "Имя имеет не правильную длинну")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Иконка дожна быть указана")]
        public IFormFile? IconFile { get; set; }
        [Required(ErrorMessage = "Шапка дожна быть указана")]
        public IFormFile? BannerFile { get; set; }
    }
}
