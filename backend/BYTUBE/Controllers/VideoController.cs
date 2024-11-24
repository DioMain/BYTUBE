using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.VideoModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly PostgresDbContext _db;
        private readonly LocalDataManager _localDataManager;
        private readonly VideoMediaService _videoMediaService;

        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private bool IsAutorize => HttpContext.User.Claims.Any();

        public VideoController(PostgresDbContext db, LocalDataManager localDataManager, VideoMediaService videoMediaService)
        {
            _db = db;
            _localDataManager = localDataManager;
            _videoMediaService = videoMediaService;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                Video? video = await _db.Videos.FirstOrDefaultAsync(i => i.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                Channel channel = await _db.Channels.Include(i => i.Subscribes).FirstAsync(i => i.Id == video.OwnerId);

                if (video.VideoAccess == Video.Access.Private)
                {
                    if (!IsAutorize || channel.UserId != UserId)
                        throw new ServerException("Видео вам не доступно", 403);
                }

                if (video.VideoStatus == Video.Status.Blocked)
                    throw new ServerException("Видео более не доспутно", 403);

                var videoLocalData = _localDataManager.GetVideoData(id);
                var channelLocalData = _localDataManager.GetChannelData(channel.Id);

                VideoFullModel model = new VideoFullModel()
                {
                    Id = video.Id,
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
                        Id = channel.Id,
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
        public async Task<IResult> GetChannelVideos([FromQuery] int channelId)
        {
            try
            {
                Video[] videos = await _db.Videos
                    .Where(item => item.OwnerId == channelId)
                    .OrderByDescending(i => i.Created)
                    .Include(video => video.Owner)
                    .ToArrayAsync();

                List<VideoModel> models = [];

                foreach (Video video in videos)
                {
                    var videoLocalData = _localDataManager.GetVideoData(video.Id);
                    var channelLocalData = _localDataManager.GetChannelData(video.Owner!.Id);

                    VideoModel videoModel = new VideoModel()
                    {
                        Id = video.Id,
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = video.Views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Channel = new ChannelModel()
                        {
                            Id = video.Owner!.Id,
                            Name = video.Owner!.Name,
                            Subscribes = video.Owner!.Subscribes.Count,
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
        public async Task<IResult> GetPlaylistVideos([FromQuery] int playlistId)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.Include(pl => pl.PlaylistItems).FirstOrDefaultAsync(pl => pl.Id == playlistId);

                if (playlist == null)
                    throw new ServerException("Плейлист не найден!", 404);

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

                var videos = await _db.Videos
                            .Include(video => video.Owner)
                            .ToListAsync();

                videos = videos
                            .Where(video => playlist.PlaylistItems.Any(item => video.Id == item.VideoId))
                            .ToList();

                List<VideoModel> models = [];

                foreach (Video video in videos)
                {
                    var videoLocalData = _localDataManager.GetVideoData(video.Id);
                    var channelLocalData = _localDataManager.GetChannelData(video.Owner!.Id);

                    VideoModel videoModel = new VideoModel()
                    {
                        Id = video.Id,
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = video.Views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Channel = new ChannelModel()
                        {
                            Id = video.Owner!.Id,
                            Name = video.Owner!.Name,
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
        public async Task<IResult> Select([FromQuery] VideoSelectOptions Options)
        {
            try
            {   
                var videos = await _db.Videos
                    .Where(video => video.VideoAccess == Video.Access.All)
                    .Include(i => i.Owner)
                    .Include(i => i.Owner!.Subscribes)
                    .ToListAsync();

                if (Options.Ignore != null)
                {
                    videos = videos.Where(video => Options.Ignore.Split(',').Any(i => int.Parse(i) != video.Id)).ToList();
                }

                if (Options.NamePattern != null)
                {
                    videos = videos.Where(video => Regex.IsMatch(video.Title, $@"(\w)*{Options.NamePattern}(\w)*")).ToList();
                }

                if (IsAutorize)
                {
                    var user = await _db.Users.FirstAsync(i => i.Id == UserId);

                    if (Options.Subscribes)
                    {
                        videos = videos.Where(i => i.Owner!.Subscribes.Any(i => i.UserId == UserId)).ToList();
                    }

                    if (Options.Favorite)
                    {
                        videos = videos.Where(video => user.LikedVideo.Any(i => i == video.Id)).ToList();
                    }
                }

                switch (Options.OrderBy)
                {
                    case VideoSelectOrderBy.Creation:
                        videos = videos.OrderBy(i => i.Created).ToList();
                        break;
                    case VideoSelectOrderBy.CreationDesc:
                        videos = videos.OrderByDescending(i => i.Created).ToList();
                        break;
                    case VideoSelectOrderBy.None:
                    default:
                        break;
                }

                videos = videos.Skip(Options.Skip).Take(Options.Take).ToList();

                return Results.Json(videos.Select(video =>
                {
                    var videoData = _localDataManager.GetVideoData(video.Id);
                    var channelData = _localDataManager.GetChannelData(video.Owner!.Id);

                    var subsCount = _db.Subscriptions.Where(i => i.ChannelId == video.Owner!.Id).Count();

                    return new VideoModel()
                    {
                        Id = video.Id,
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Views = video.Views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoData.PreviewExtention}",

                        Channel = new ChannelModel()
                        {
                            Id = video.Owner.Id,
                            Name = video.Owner.Name,
                            IsSubscripted = false,
                            Subscribes = subsCount,
                            IconUrl = $"/data/channels/{video.Owner.Id}/icon.{channelData.IconExtention}"
                        }
                    };
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateVideoModel model, [FromQuery] int channelId)
        {
            try
            {
                if (!await _db.Channels.AnyAsync(c => c.Id == channelId && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                var video = await _db.Videos.AddAsync(new Video()
                {
                    Title = model.Title,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    Dislikes = [],
                    Likes = [],
                    Views = 0,
                    Tags = model.Tags,
                    Duration = "00:00",
                    OwnerId = channelId,
                    VideoAccess = model.VideoAccess,
                    VideoStatus = model.VideoStatus,
                });

                await _db.SaveChangesAsync();

                await _localDataManager.SaveVideoFiles(video.Entity.Id, model.PreviewFile!, model.VideoFile!);

                var videoInfo = await _videoMediaService
                    .GetMediaInfo($"{LocalDataManager.VideosPath}/{video.Entity.Id}/video.{_localDataManager.GetVideoData(video.Entity.Id).VideoExtention}");

                int minutes = (int)Math.Floor(videoInfo.Duration.TotalSeconds / 60);
                int secound = (int)videoInfo.Duration.TotalSeconds - (minutes * 60);

                video.Entity.Duration = $"{minutes}:{secound}";

                _db.Videos.Update(video.Entity);

                await _db.SaveChangesAsync();

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

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromForm] EditVideoModel model, [FromQuery] int id, [FromQuery] int channelId)
        {
            try
            {
                if (!await _db.Channels.AnyAsync(c => c.Id == channelId && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video? video = await _db.Videos.FirstOrDefaultAsync(v => v.Id == id);

                if (video == null)
                    throw new ServerException("Видео не существует", 404);

                if (video.OwnerId != channelId)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                video.Title = model.Title;
                video.Description = model.Description;
                video.Tags = model.Tags;
                video.VideoAccess = model.VideoAccess;

                if (model.PreviewFile != null)
                    await _localDataManager.SaveVideoFiles(video.Id, model.PreviewFile!);

                _db.Videos.Update(video);

                await _db.SaveChangesAsync();

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
        public async Task<IResult> Delete([FromQuery] int id, [FromQuery] int channelId)
        {
            try
            {
                if (!await _db.Channels.AnyAsync(c => c.Id == channelId && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video? video = await _db.Videos.FirstOrDefaultAsync(v => v.Id == id);

                if (video == null)
                    throw new ServerException("Видео не существует", 404);

                if (video.OwnerId != channelId)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                Directory.Delete($"{LocalDataManager.VideosPath}/{id}", true);

                _db.Videos.Remove(video);
                await _db.SaveChangesAsync();

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

        [HttpGet("/data/videos/{id:int}/video.mp4")]
        public async Task<IResult> StreamVideo([FromRoute] int id)
        {
            try
            {
                string path = $"./Data/videos/{id}/video.mp4";

                if (!System.IO.File.Exists(path))
                    throw new ServerException("Файла больше не существует!", 404);

                Video video = await _db.Videos.Include(i => i.Owner).FirstAsync(i => i.Id == id);

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
        public async Task<IResult> GetMark([FromQuery] int id)
        {
            try
            {
                var video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);


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
        public async Task<IResult> LikeVideo([FromQuery] int id)
        {
            try
            {
                var video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                var user = await _db.Users.FirstAsync(usr => usr.Id == UserId);

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

                _db.Videos.Update(video);
                _db.Users.Update(user);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("dislike"), Authorize]
        public async Task<IResult> DislikeVideo([FromQuery] int id)
        {
            try
            {
                var video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                var user = await _db.Users.FirstAsync(usr => usr.Id == UserId);

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

                _db.Videos.Update(video);
                _db.Users.Update(user);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("view")]
        public async Task<IResult> AddView([FromQuery] int id)
        {
            try
            {
                var video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == id);

                if (video == null)
                    throw new ServerException("Video not found", 404);

                video.Views++;

                _db.Videos.Update(video);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
