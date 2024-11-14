using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.VideoModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                Video? videoData = await _db.Videos.FirstOrDefaultAsync(i => i.Id == id);

                if (videoData == null)
                    throw new ServerException("Видео не найдено", 404);

                Channel channel = await _db.Channels.Include(i => i.Subscribes).FirstAsync(i => i.Id == videoData.OwnerId);

                if (videoData.VideoAccess == Video.Access.Private && channel.UserId != UserId)
                    throw new ServerException("Видео вам не доступно", 403);

                if (videoData.VideoStatus == Video.Status.Blocked)
                    throw new ServerException("Видео более не доспутно", 403);

                var videoLocalData = _localDataManager.GetVideoData(id);
                var channelLocalData = _localDataManager.GetChannelData(channel.Id);

                VideoFullModel videoModel = new VideoFullModel()
                {
                    Id = videoData.Id,
                    Title = videoData.Title,
                    Description = videoData.Description ?? "",
                    Duration = videoData.Duration,
                    Created = videoData.Created,
                    Views = videoData.Views,
                    Tags = videoData.Tags,
                    VideoUrl = $"/data/videos/{id}/video.{videoLocalData.VideoExtention}",
                    PreviewUrl = $"/data/videos/{id}/preview.{videoLocalData.PreviewExtention}",
                    VideoAccess = videoData.VideoAccess,
                    VideoStatus = videoData.VideoStatus,
                    
                    Channel = new ChannelModel()
                    {
                        Id = channel.Id,
                        Name = channel.Name,
                        Subscribes = channel.Subscribes.Count,
                        IconUrl = $"/data/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
                    }
                };

                return Results.Json(videoModel);
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
                Video[] videos = await _db.Videos.Where(item => item.OwnerId == channelId).Include(video => video.Owner).ToArrayAsync();

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

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateVideoModel model, [FromQuery] int channelId)
        {
            try
            {
                if (!await _db.Channels.AnyAsync(c => c.Id == channelId && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 401);

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

        [HttpGet("range")]
        public async Task<IResult> GetRange([FromQuery] int skip = 0, [FromQuery] int take = 30)
        {
            try
            {
                Video[] videoDatas = [.. await _db.Videos.Skip(skip).Take(take).OrderBy(i => i.Id)
                    .Include(i => i.Owner)
                    .Include(i => i.Owner.Subscribes).ToArrayAsync()];

                VideoModel[] models = videoDatas.Select(videoData =>
                {
                    Channel channel = videoData.Owner;

                    var videoLocalData = _localDataManager.GetVideoData(videoData.Id);
                    var channelLocalData = _localDataManager.GetChannelData(channel.Id);

                    return new VideoModel()
                    {
                        Id = videoData.Id,
                        Title = videoData.Title,
                        Duration = videoData.Duration,
                        Created = videoData.Created,
                        Views = videoData.Views,
                        VideoAccess = videoData.VideoAccess,
                        VideoStatus = videoData.VideoStatus,
                        PreviewUrl = $"/data/videos/{videoData.Id}/preview.{videoLocalData.PreviewExtention}",
                        Channel = new ChannelModel()
                        {
                            Id = channel.Id,    
                            Name = channel.Name,
                            Subscribes = channel.Subscribes.Count,
                            IconUrl = $"/data/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
                        }
                    };
                }).ToArray();

                return Results.Json(models);
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
    }
}
