using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.ChannelModels
{
    public class CreateVideoModel
    {
        [Required(ErrorMessage = "Имя должно быть")]
        [Length(3, 32, ErrorMessage = "Имя имеет не правильную длинну")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Описание должно быть")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Теги дожны быть")]
        public List<string> Tags { get; set; } = [];

        [Required]
        public Video.Access VideoAccess { get; set; }
        [Required]
        public Video.Status VideoStatus { get; set; }

        [Required(ErrorMessage = "Превью видео должно быть указано")]
        public IFormFile? PreviewFile { get; set; }
        [Required(ErrorMessage = "Видео должно быть указано")]
        public IFormFile? VideoFile { get; set; }
    }
}
