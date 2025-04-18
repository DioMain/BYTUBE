namespace BYTUBE.Models.VideoModels
{
    public class VideoViewModel
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public Guid VideoId { get; set; }

        public DateTime Created { get; set; }
    }
}
