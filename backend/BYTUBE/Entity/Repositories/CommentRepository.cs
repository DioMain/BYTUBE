using BYTUBE.Entity.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BYTUBE.Entity.Repositories
{
    public class CommentRepository : RepositoryBase<Comment>
    {
        public CommentRepository(PostgresDbContext context) : base(context)
        {
        }

        public override void Create(Comment value)
        {
            Context.Comments.Add(value);
        }

        public override void Delete(Guid guid)
        {
            var val = Get(guid);

            if (val == null)
                return;

            Context.Comments.Remove(val);
        }

        public override Comment? Get(Guid guid)
        {
            return Context.Comments.Find(guid);
        }

        public override List<Comment> GetAll()
        {
            return Context.Comments.ToList();
        }

        public override void Update(Comment value)
        {
            Context.Comments.Update(value);
        }

        public async Task<Comment?> GetCommentWithAuthor(Guid guid)
        {
            return await Context.Comments
                    .Include(i => i.User)
                    .FirstOrDefaultAsync(i => i.Id == guid);
        }
    }
}
