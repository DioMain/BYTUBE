using BYTUBE.Models.ChannelModels;
using BYTUBE.Entity.Models;

namespace BYTUBE.Models.VideoModels
{
    public class VideoFullModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Views { get; set; }

        public List<string> Tags { get; set; }

        public DateTime Created { get; set; }

        public Video.Status VideoStatus { get; set; }
        public Video.Access VideoAccess { get; set; }

        public string Duration { get; set; }

        public string PreviewUrl { get; set; }
        public string VideoUrl { get; set; }

        public ChannelModel Channel { get; set; }
    }
}
