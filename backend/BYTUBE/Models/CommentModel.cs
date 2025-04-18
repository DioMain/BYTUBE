using BYTUBE.Models.UserModels;

namespace BYTUBE.Models
{
    public class CommentModel
    {
        public string? Id { get; set; }

        public required string Message { get; set; }

        public string? UserId { get; set; }

        public string VideoId { get; set; }

        public DateTime? Created { get; set; }

        public int? LikesCount { get; set; }
        public bool? UserIsLikeIt { get; set; }
        public bool? IsVideoOwner { get; set; }

        public UserPublicModel? User {  get; set; }
    }
}
