namespace BYTUBE.Models
{
    public class VideoSelectOptions
    {
        public string? Ignore { get; set; }
        public string? NamePattern { get; set; }

        public int Take { get; set; } = 6;
        public int Skip { get; set; } = 0;

        public bool Favorite { get; set; } = false;
        public bool Subscribes { get; set; } = false;

        public VideoSelectOrderBy OrderBy { get; set; } = VideoSelectOrderBy.None;
    }

    public enum VideoSelectOrderBy
    {
        None, Creation, CreationDesc
    }
}
