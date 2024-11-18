namespace BYTUBE.Models
{
    public class CommentModel
    {
        public int? Id { get; set; }

        public string Message { get; set; }

        public int? ParentId { get; set; }

        public int? UserId { get; set; }

        public int VideoId { get; set; }

        public List<CommentModel>? Childrens { get; set; }
    }
}
