using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.VideoModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Threading.Channels;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly PostgresDbContext _dbContext;
        private readonly LocalDataService _localData;
        private readonly VideoMediaService _videoMedia;

        private Guid UserId => Guid.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private bool IsAutorize => HttpContext.User.Claims.Any();
        private User.RoleType Role => Enum.Parse<User.RoleType>(HttpContext.User.Claims.ToArray()[1].Value);

        public VideoController(PostgresDbContext db, LocalDataService localData, VideoMediaService videoMedia)
        {
            _dbContext = db;
            _localData = localData;
            _videoMedia = videoMedia;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Video video = await _dbContext.Videos.FindAsync(guid) 
                    ?? throw new ServerException("Видео не найдено", 404);

                Entity.Models.Channel channel = await _dbContext.Channels
                    .Include(i => i.Subscribes)
                    .FirstAsync(i => i.Id == video.OwnerId);

                if (video.VideoAccess == Video.Access.Private)
                {
                    if (!IsAutorize || channel.UserId != UserId)
                        throw new ServerException("Видео вам не доступно", 403);
                }

                if (video.VideoStatus == Video.Status.Blocked)
                    throw new ServerException("Видео более не доспутно", 403);

                var videoLocalData = _localData.GetVideoData(guid);
                var channelLocalData = _localData.GetChannelData(channel.Id);

                VideoFullModel model = new VideoFullModel()
                {
                    Id = video.Id.ToString(),
                    Title = video.Title,
                    Description = video.Description ?? "",
                    Duration = video.Duration,
                    Created = video.Created,
                    Views = video.Views,
                    Tags = video.Tags,
                    VideoUrl = $"/data/videos/{id}/video.{videoLocalData.VideoExtention}",
                    PreviewUrl = $"/data/videos/{id}/preview.{videoLocalData.PreviewExtention}",
                    VideoAccess = video.VideoAccess,
                    VideoStatus = video.VideoStatus,

                    Channel = new ChannelModel()
                    {
                        Id = channel.Id.ToString(),
                        Name = channel.Name,
                        IsSubscripted = false,
                        Subscribes = channel.Subscribes.Count,
                        IconUrl = $"/data/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
                    }
                };

                if (IsAutorize)
                {
                    model.Channel.IsSubscripted = channel.Subscribes.Any(i => i.UserId == UserId);
                }

                return Results.Json(model);
            }
            catch (ServerException srverr)
            {
                return Results.Json(srverr.GetModel(), statusCode: srverr.Code);
            }
            catch
            {
                return Results.Problem(statusCode: 400);
            }
        }

        [HttpGet("channel")]
        public async Task<IResult> GetChannelVideos([FromQuery] string channelId)
        {
            try
            {
                if (!Guid.TryParse(channelId, out Guid cguid))
                    throw new ServerException("cid is not correct!");

                Video[] videos = await _dbContext.Videos
                    .Where(item => item.OwnerId == cguid
                                && item.VideoAccess == Video.Access.All
                                && item.VideoStatus == Video.Status.NoLimit)
                    .OrderByDescending(i => i.Created)
                    .Include(video => video.Owner)
                    .ToArrayAsync();

                List<VideoModel> models = [];
                foreach (Video video in videos)
                {
                    var videoLocalData = _localData.GetVideoData(video.Id);
                    var channelLocalData = _localData.GetChannelData(video.Owner!.Id);

                    VideoModel videoModel = new VideoModel()
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = video.Views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Channel = new ChannelModel()
                        {
                            Id = video.Owner.Id.ToString(),
                            Name = video.Owner.Name,
                            Subscribes = video.Owner.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Owner!.Id}/icon.{channelLocalData.IconExtention}"
                        }
                    };

                    models.Add(videoModel);
                }

                return Results.Json(models);
            }
            catch
            {
                return Results.Problem(statusCode: 400);
            }
        }

        [HttpGet("playlist")]
        public async Task<IResult> GetPlaylistVideos([FromQuery] string playlistId)
        {
            try
            {
                if (!Guid.TryParse(playlistId, out Guid pguid))
                    throw new ServerException("cid is not correct!");

                Playlist? playlist = await _dbContext.Playlists
                    .Include(pl => pl.PlaylistItems)
                    .FirstOrDefaultAsync(pl => pl.Id == pguid)
                    ?? throw new ServerException("Плейлист не найден!", 404);

                if (playlist.Access == Playlist.AccessType.Private)
                {
                    if (IsAutorize)
                    {
                        if (UserId != playlist.UserId)
                            throw new ServerException("Видео плейлиста не доступены!", 403);
                    }
                    else
                        throw new ServerException("Не авторизован!", 401);
                }

                var videos = await _dbContext.Videos
                            .Include(video => video.Owner)
                            .ToListAsync();

                videos = [.. videos.Where(video => playlist.PlaylistItems.Any(item => video.Id == item.VideoId))];

                List<VideoModel> models = [];

                foreach (Video video in videos)
                {
                    var videoLocalData = _localData.GetVideoData(video.Id);
                    var channelLocalData = _localData.GetChannelData(video.Owner!.Id);

                    var videoModel = new VideoModel()
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = video.Views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Channel = new ChannelModel()
                        {
                            Id = video.Owner.Id.ToString(),
                            Name = video.Owner.Name,
                            Subscribes = video.Owner!.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Owner!.Id}/icon.{channelLocalData.IconExtention}"
                        }
                    };

                    models.Add(videoModel);
                }

                return Results.Json(models);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(detail: err.Message, statusCode: 400);
            }
        }

        [HttpGet("select")]
        public async Task<IResult> Select([FromQuery] SelectOptions options)
        {
            try
            {
                var tagPattern = @"#\w+";
                var tags = Regex.Matches(options.SearchPattern, tagPattern)
                                .Cast<Match>()
                                .Select(m => m.Value)
                                .ToList();

                var query = _dbContext.Videos
                    .Include(video => video.Owner)                         
                        .ThenInclude(o => o.Subscribes)             
                    .Include(video => video.Reports)                       
                    .AsQueryable();

                if (!(options.AsAdmin && IsAutorize && Role == Entity.Models.User.RoleType.Admin))
                {
                    query = query.Where(video => video.VideoAccess == Video.Access.All);
                    query = query.Where(video => video.VideoStatus == Video.Status.NoLimit);
                }

                // TODO

                //if (tags.Any())
                //{
                //    query = query.Where(video => video.Tags.Any(tag => tags.Any(tag1 => tag1 == tag)));
                //}

                if (!string.IsNullOrEmpty(options.Ignore))
                {
                    var ignoredIds = options.Ignore.Split(',').Select(Guid.Parse);
                    query = query.Where(video => !ignoredIds.Contains(video.Id));
                }

                if (!string.IsNullOrEmpty(options.SearchPattern))
                {
                    query = query.Where(video => Regex.IsMatch(video.Title, $@"(\w)*{options.SearchPattern}(\w)*"));
                }

                if (IsAutorize)
                {
                    var user = await _dbContext.Users.FirstAsync(i => i.Id == UserId);

                    if (options.Subscribes)
                    {
                        query = query.Where(video => video.Owner!.Subscribes.Any(sub => sub.UserId == UserId));
                    }

                    if (options.Favorite)
                    {
                        var likedVideoIds = user.LikedVideo;
                        query = query.Where(video => likedVideoIds.Contains(video.Id));
                    }
                }

                query = options.OrderBy switch
                {
                    SelectOrderBy.Creation => query.OrderBy(video => video.Created),
                    SelectOrderBy.CreationDesc => query.OrderByDescending(video => video.Created),
                    SelectOrderBy.Reports => query.OrderBy(video => video.Reports.Count),
                    SelectOrderBy.ReportsDesc => query.OrderByDescending(video => video.Reports.Count),
                    SelectOrderBy.Views => query.OrderByDescending(video => video.Views),
                    _ => query
                };

                query = query.Skip(options.Skip).Take(options.Take);

                var videos = await query.ToListAsync();

                var result = videos.Select(video =>
                {
                    var videoData = _localData.GetVideoData(video.Id);
                    var channelData = _localData.GetChannelData(video.Owner!.Id);

                    return new VideoModel
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Views = video.Views,
                        ReportsCount = video.Reports.Count,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoData.PreviewExtention}",

                        Channel = new ChannelModel
                        {
                            Id = video.Owner.Id.ToString(),
                            Name = video.Owner.Name,
                            IsSubscripted = false,
                            Subscribes = video.Owner.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Owner.Id}/icon.{channelData.IconExtention}"
                        }
                    };
                });

                return Results.Json(result);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateVideoModel model, [FromQuery] string channelId)
        {
            try
            {
                if (!Guid.TryParse(channelId, out Guid cguid))
                    throw new ServerException("cid is not correct!");

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == cguid && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                var video = await _dbContext.Videos.AddAsync(new Video()
                {
                    Title = model.Title,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    Dislikes = [],
                    Likes = [],
                    Views = 0,
                    Tags = model.Tags,
                    Duration = "00:00",
                    OwnerId = cguid,
                    VideoAccess = model.VideoAccess,
                    VideoStatus = model.VideoStatus,
                });

                await _dbContext.SaveChangesAsync();

                await _localData.SaveVideoFiles(video.Entity.Id, model.PreviewFile!, model.VideoFile!);

                var localVideoData = _localData.GetVideoData(video.Entity.Id);

                var videoInfo = await _videoMedia
                    .GetMediaInfo($"{LocalDataService.VideosPath}/{video.Entity.Id}/video.{localVideoData.VideoExtention}");

                int minutes = (int)Math.Floor(videoInfo.Duration.TotalSeconds / 60);
                int secound = (int)videoInfo.Duration.TotalSeconds - (minutes * 60);

                string minutesString = minutes.ToString();
                string secoundsString = minutes.ToString();

                minutesString = minutesString.Length == 1 ? $"0{minutesString}" : minutesString;
                secoundsString = secoundsString.Length == 1 ? $"0{secoundsString}" : secoundsString;

                video.Entity.Duration = $"{minutesString}:{secoundsString}";

                _dbContext.Videos.Update(video.Entity);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }
        }

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromForm] EditVideoModel model, [FromQuery] string id, [FromQuery] string channelId)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                if (!Guid.TryParse(channelId, out Guid cguid))
                    throw new ServerException("cid is not correct!");

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == cguid && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video video = await _dbContext.Videos.FindAsync(guid)
                    ?? throw new ServerException("Видео не существует", 404);

                if (video.OwnerId != cguid)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                video.Title = model.Title;
                video.Description = model.Description;
                video.Tags = model.Tags;
                video.VideoAccess = model.VideoAccess;

                if (model.PreviewFile != null)
                    await _localData.SaveVideoFiles(video.Id, model.PreviewFile!);

                _dbContext.Videos.Update(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch
            {
                return Results.Problem("Error", statusCode: 400);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] string id, [FromQuery] string channelId)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                if (!Guid.TryParse(channelId, out Guid cguid))
                    throw new ServerException("cid is not correct!");

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == cguid && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video? video = await _dbContext.Videos.FindAsync(guid)
                    ?? throw new ServerException("Видео не существует", 404);

                if (video.OwnerId != cguid)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                Directory.Delete($"{LocalDataService.VideosPath}/{id}", true);

                _dbContext.Videos.Remove(video);
                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch
            {
                return Results.Problem("Error", statusCode: 400);
            }
        }

        [HttpGet("/data/videos/{id:guid}/video.mp4")]
        public async Task<IResult> StreamVideo([FromRoute] Guid id)
        {
            try
            {
                string path = $"./Data/videos/{id}/video.mp4";

                if (!System.IO.File.Exists(path))
                    throw new ServerException("Файла больше не существует!", 404);

                Video video = await _dbContext.Videos
                    .Include(i => i.Owner)
                    .FirstAsync(i => i.Id == id);

                if (video.VideoAccess == Video.Access.Private)
                {
                    if ((IsAutorize && UserId != video.Owner.UserId) || !IsAutorize)
                        throw new ServerException("Видео файл не доступен!", 403);
                }

                if (video.VideoStatus == Video.Status.Blocked)
                    throw new ServerException("Видео файл не доступен!", 403);

                HttpContext.Response.Headers.Append("Accept-Ranges", "bytes");

                var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read | FileShare.Delete);
                var fileLength = fileStream.Length;

                if (Request.Headers.ContainsKey("Range"))
                {
                    var rangeHeader = Request.Headers["Range"].ToString();
                    var range = rangeHeader.Replace("bytes=", "").Split('-');
                    var start = long.Parse(range[0]);
                    var end = range.Length > 1 && !string.IsNullOrEmpty(range[1])
                        ? long.Parse(range[1])
                        : fileLength - 1;

                    var chunkSize = end - start + 1;
                    fileStream.Seek(start, SeekOrigin.Begin);

                    return Results.File(
                        fileStream,
                        "video/mp4",
                        enableRangeProcessing: true);
                }

                return Results.File(fileStream, "video/mp4");
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }
        }

        [HttpGet("mark")]
        public async Task<IResult> GetMark([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                var video = await _dbContext.Videos.FindAsync(guid) 
                    ?? throw new ServerException("Видео не найдено", 404);

                VideoMarkModel model = new VideoMarkModel
                {
                    LikesCount = video.Likes.Count,
                    DislikesCount = video.Dislikes.Count
                };

                if (IsAutorize)
                {
                    model.UserIsLikeIt = video.Likes.Any(i => i == UserId);
                    model.UserIsDislikeIt = video.Dislikes.Any(i => i == UserId);
                }

                return Results.Json(model);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("like"), Authorize]
        public async Task<IResult> LikeVideo([FromQuery] Guid id)
        {
            try
            {
                var video = await _dbContext.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                var user = await _dbContext.Users.FirstAsync(usr => usr.Id == UserId);

                if (!video.Likes.Contains(UserId))
                {
                    video.Likes.Add(UserId);

                    user.LikedVideo.Add(video.Id);

                    if (video.Dislikes.Contains(UserId))
                        video.Dislikes.Remove(UserId);
                }
                else
                {
                    video.Likes.Remove(UserId);
                    user.LikedVideo.Remove(video.Id);
                }

                _dbContext.Videos.Update(video);
                _dbContext.Users.Update(user);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("dislike"), Authorize]
        public async Task<IResult> DislikeVideo([FromQuery] Guid id)
        {
            try
            {
                var video = await _dbContext.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                var user = await _dbContext.Users.FirstAsync(usr => usr.Id == UserId);

                if (!video.Dislikes.Contains(UserId))
                {
                    video.Dislikes.Add(UserId);

                    if (video.Likes.Contains(UserId))
                    {
                        video.Likes.Remove(UserId);
                        user.LikedVideo.Remove(video.Id);
                    }
                }
                else
                    video.Dislikes.Remove(UserId);

                _dbContext.Videos.Update(video);
                _dbContext.Users.Update(user);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("view")]
        public async Task<IResult> AddView([FromQuery] Guid id)
        {
            try
            {
                var video = await _dbContext.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Video not found", 404);

                video.Views++;

                _dbContext.Videos.Update(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete("delete"), Authorize]
        public async Task<IResult> DeleteByAdmin([FromQuery] Guid id)
        {
            try
            {
                if (Role != Entity.Models.User.RoleType.Admin)
                    throw new ServerException("Вы не администратор!", 403);

                var video = await _dbContext.Videos.Include(i => i.Owner).FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдена!", 404);

                Directory.Delete($"{LocalDataService.VideosPath}/{id}", true);

                _dbContext.Videos.Remove(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Json(err.Message, statusCode: 500);
            }
        }

        [HttpPut("block"), Authorize(Roles = "Admin")]
        public async Task<IResult> BlockingByAdmin([FromQuery] Guid id)
        {
            try
            {
                if (Role != Entity.Models.User.RoleType.Admin)
                    throw new ServerException("Вы не администратор!", 403);

                var video = await _dbContext.Videos.FindAsync(id)
                    ?? throw new ServerException("Видео не найдена!", 404);

                if (video.VideoStatus == Video.Status.NoLimit)
                    video.VideoStatus = Video.Status.Blocked;
                else
                    video.VideoStatus = Video.Status.NoLimit;

                _dbContext.Videos.Update(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Json(err.Message, statusCode: 500);
            }
        }
    }
}
