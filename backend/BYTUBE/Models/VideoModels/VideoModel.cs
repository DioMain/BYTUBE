using BYTUBE.Entity.Models;
using BYTUBE.Models.ChannelModels;

namespace BYTUBE.Models.VideoModels
{
    public class VideoModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public int Views { get; set; }
        public int? ReportsCount { get; set; }

        public bool ForAdults { get; set; }

        public DateTime Created { get; set; }

        public Video.Status VideoStatus { get; set; }
        public Video.Access VideoAccess { get; set; }

        public string Duration { get; set; }

        public string PreviewUrl { get; set; }

        public ChannelModel Channel { get; set; }
    }
}
