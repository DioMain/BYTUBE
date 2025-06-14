﻿using BYTUBE.Entity.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BYTUBE.Entity.Repositories
{
    public class CommentRepository : RepositoryBase<Comment>
    {
        public CommentRepository(PostgresDbContext context) : base(context)
        {
        }

        public async Task<Comment?> GetCommentWithAuthor(Guid guid)
        {
            return await _context.Comments
                    .Include(i => i.User)
                    .FirstOrDefaultAsync(i => i.Id == guid);
        }

        public async Task<Comment[]> GetVideoComments(Guid videoGuid)
        {
            return await _context.Comments
                    .Include(i => i.User)
                    .Include(i => i.Video)
                        .ThenInclude(i => i.Channel)
                    .Where(i => i.VideoId == videoGuid)
                    .OrderBy(i => i.Created)
                    .ToArrayAsync();
        }

        public async Task<Comment?> GetWithVideoAndChannel(Guid guid)
        {
            return await _context.Comments
                          .Include(i => i.Video)
                            .ThenInclude(i => i.Channel)
                          .FirstOrDefaultAsync(c => c.Id == guid);
        }
    }
}
