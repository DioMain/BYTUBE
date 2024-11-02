using BYTUBE.Models.ChannelModels;

namespace BYTUBE.Models.VideoModels
{
    public class VideoModel
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public int Views { get; set; }

        public DateTime Created { get; set; }

        public string Duration { get; set; }

        public string PreviewUrl { get; set; }

        public ChannelModel Channel { get; set; }
    }
}
