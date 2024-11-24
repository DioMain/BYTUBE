using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.ChannelModels
{
    public class EditChannelModel
    {
        [Required(ErrorMessage = "Имя должно быть")]
        [Length(3, 32, ErrorMessage = "Имя имеет не правильную длинну")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public IFormFile? IconFile { get; set; }
        public IFormFile? BannerFile { get; set; }
    }
}
