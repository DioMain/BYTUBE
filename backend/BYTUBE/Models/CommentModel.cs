using BYTUBE.Models.UserModels;

namespace BYTUBE.Models
{
    public class CommentModel
    {
        public int? Id { get; set; }

        public string Message { get; set; }

        public int? UserId { get; set; }

        public int VideoId { get; set; }

        public DateTime? Created { get; set; }

        public int? LikesCount { get; set; }
        public bool? UserIsLikeIt { get; set; }
        public bool? IsVideoOwner { get; set; }

        public UserPublicModel? User {  get; set; }
    }
}
