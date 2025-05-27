using BYTUBE.Entity.Models;
using BYTUBE.Helpers;
using BYTUBE.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BYTUBE.Entity.Repositories
{
    public class VideoRepository : RepositoryBase<Video>
    {
        public VideoRepository(PostgresDbContext context) : base(context)
        {
        }

        public async Task<Video?> FindVideoWithChannel(Guid guid, Guid channelGuid)
        {
            return await _context.Videos
                .Include(video => video.Channel)
                .FirstOrDefaultAsync(video => video.Id == guid && video.Channel.Id == channelGuid);
        }

        public async Task<Video[]> Select(SelectOptions options, AuthorizeData authData)
        {
            var tagPattern = @"#\w+";
            var tags = Regex.Matches(options.SearchPattern, tagPattern)
                            .Cast<Match>()
                            .Select(m => m.Value[1..])
                            .ToList();

            var searchPatternNoTags = Regex.Replace(options.SearchPattern, tagPattern, "").Trim();

            var query = _context.Videos
                   .Include(Video => Video.Marks)
                   .Include(Video => Video.Views)
                   .Include(video => video.Channel)
                       .ThenInclude(o => o.Subscribes)
                   .Include(video => video.Reports)
                   .AsQueryable();


            if (!(options.AsAdmin && authData.IsAutorize && authData.Role == Entity.Models.User.RoleType.Admin))
            {
                query = query.Where(video => video.VideoAccess == Video.Access.All);

                if (options.OnlyUnlimited)
                    query = query.Where(
                        video => video.VideoStatus == Video.Status.NoLimit
                     && video.Channel.Status == Channel.ActiveStatus.Normal);
                else
                    query = query.Where(video =>
                        (video.VideoStatus == Video.Status.NoLimit || video.VideoStatus == Video.Status.Limited)
                     && (video.Channel.Status == Channel.ActiveStatus.Normal || video.Channel.Status == Channel.ActiveStatus.Limited));
            }

            if (!string.IsNullOrEmpty(options.Ignore))
            {
                var ignoredIds = options.Ignore.Split(',').Select(Guid.Parse);
                query = query.Where(video => !ignoredIds.Contains(video.Id));
            }

            if (!string.IsNullOrEmpty(searchPatternNoTags))
            {
                query = query.Where(video => Regex.IsMatch(video.Title, $@"(\w)*{searchPatternNoTags}(\w)*"));
            }

            if (authData.IsAutorize)
            {
                var user = await _context.Users.FirstAsync(i => i.Id == authData.Id);

                if (options.OnlyAllAges)
                {
                    query = query.Where(video => !video.ForAdults);
                }

                if (options.Subscribes)
                {
                    query = query.Where(video => video.Channel!.Subscribes.Any(sub => sub.UserId == authData.Id));
                }

                if (options.Favorite)
                {
                    query = query.Where(video => video.Marks.Any(mark => mark.UserId == user.Id && mark.IsLike));
                }
            }

            query = options.OrderBy switch
            {
                SelectOrderBy.Creation => query.OrderBy(video => video.Created),
                SelectOrderBy.CreationDesc => query.OrderByDescending(video => video.Created),
                SelectOrderBy.Reports => query.OrderBy(video => video.Reports.Count),
                SelectOrderBy.ReportsDesc => query.OrderByDescending(video => video.Reports.Count),
                SelectOrderBy.Views => query.OrderByDescending(video => video.Views.Count),
                _ => query
            };

            var videos = await query.ToListAsync();

            if (tags.Count != 0)
            {
                videos = videos.Where(video => video.Tags.Any(vtag => tags.Contains(vtag))).ToList();
            }

            return videos.Skip(options.Skip).Take(options.Take).ToArray();
        }

        public async Task<Playlist?> GetPlaylistWithVideo(Guid playlistGuid)
        {
            return await _context.Playlists
                    .Include(pl => pl.PlaylistItems)
                        .ThenInclude(item => item.Video)
                            .ThenInclude(video => video.Channel)
                    .FirstOrDefaultAsync(pl => pl.Id == playlistGuid);
        }
    }
}
