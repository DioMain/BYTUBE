namespace BYTUBE.Models.VideoModels
{
    public class VideoFullModel : VideoModel
    {
        public string Description { get; set; }

        public List<string> Tags { get; set; }

        public string VideoUrl { get; set; }
    }
}
