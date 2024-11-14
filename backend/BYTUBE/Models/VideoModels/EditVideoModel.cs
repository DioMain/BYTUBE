using BYTUBE.Entity.Models;
using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models.ChannelModels
{
    public class EditVideoModel
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

        public IFormFile? PreviewFile { get; set; }
    }
}
