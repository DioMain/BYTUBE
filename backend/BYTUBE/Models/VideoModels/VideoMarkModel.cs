namespace BYTUBE.Models.VideoModels
{
    public class VideoMarkModel
    {
        public int LikesCount { get; set; }
        public int DislikesCount { get; set; }

        public bool UserIsLikeIt { get; set; }
        public bool UserIsDislikeIt { get; set; }
    }
}
