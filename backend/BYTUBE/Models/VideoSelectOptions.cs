namespace BYTUBE.Models
{
    public class VideoSelectOptions
    {
        public string? Ignore { get; set; }
        public string? NamePattern { get; set; }

        public int Take { get; set; } = 6;
        public int Skip { get; set; } = 0;
    }
}
