namespace BYTUBE.Models.VideoModels
{
    public class VideoFullModel : VideoModel
    {
        public List<string> Tags { get; set; }

        public string VideoUrl { get; set; }
    }
}
