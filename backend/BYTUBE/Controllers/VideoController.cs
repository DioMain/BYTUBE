using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.VideoModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xabe.FFmpeg;

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
                Video? videoData = await _db.Videos.FirstOrDefaultAsync(i => i.Id == i.Id);

                if (videoData == null)
                    throw new ServerException("Видео не найдено", 404);

                Channel channel = await _db.Channels.Include(i => i.Subscribes).FirstAsync(i => i.Id == videoData.OwnerId);

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
                    VideoUrl = $"/videos/{id}/video.{videoLocalData.VideoExtention}",
                    PreviewUrl = $"/videos/{id}/preview.{videoLocalData.PreviewExtention}",
                    Channel = new ChannelModel()
                    {
                        Id = channel.Id,
                        Name = channel.Name,
                        Subscribes = channel.Subscribes.Count,
                        IconUrl = $"/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
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

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateVideoModel model, [FromQuery] int channelId)
        {
            try
            {
                if (!await _db.Channels.AnyAsync(c => c.Id == channelId && c.UserId == UserId))
                    throw new ServerException("Канал вам не пренадлежит", 401);

                Video video = (await _db.Videos.AddAsync(new Video()
                {
                    Title = model.Title,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    Dislikes = [],
                    Likes = [],
                    Views = 0,
                    Tags = model.Tags,
                    Duration = "00:00",
                    OwnerId = channelId
                })).Entity;

                await _db.SaveChangesAsync();

                await _localDataManager.SaveVideoFiles(video.Id, model.PreviewFile!, model.VideoFile!);

                var videoInfo = await _videoMediaService.GetMediaInfo("");

                int minutes = (int)Math.Floor(videoInfo.Duration.TotalSeconds / 60);
                int secound = (int)videoInfo.Duration.TotalSeconds - (minutes * 60);

                video.Duration = $"{minutes}:{secound}";

                _db.Videos.Update(video);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
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
                        PreviewUrl = $"/videos/{videoData.Id}/preview.{videoLocalData.PreviewExtention}",
                        Channel = new ChannelModel()
                        {
                            Id = channel.Id,    
                            Name = channel.Name,
                            Subscribes = channel.Subscribes.Count,
                            IconUrl = $"/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
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
