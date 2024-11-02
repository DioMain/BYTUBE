using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using BYTUBE.Services;
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

        public VideoController(PostgresDbContext db, LocalDataManager localDataManager)
        {
            _db = db;
            _localDataManager = localDataManager;
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

                VideoModel videoModel = new VideoModel()
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
                        Description = channel.Description ?? "",
                        Created = channel.Created,
                        Subscribes = channel.Subscribes.Count,
                        IconUrl = $"/channels/{channel.Id}/icon.{channelLocalData.IconExtention}",
                        HeaderUrl = $"/channels/{channel.Id}/banner.{channelLocalData.HeaderExtention}"
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
                        Description = videoData.Description ?? "",
                        Duration = videoData.Duration,
                        Created = videoData.Created,
                        Views = videoData.Views,
                        Tags = videoData.Tags,
                        VideoUrl = $"/videos/{videoData.Id}/video.{videoLocalData.VideoExtention}",
                        PreviewUrl = $"/videos/{videoData.Id}/preview.{videoLocalData.PreviewExtention}",
                        Channel = new ChannelModel()
                        {
                            Id = channel.Id,    
                            Name = channel.Name,
                            Description = channel.Description ?? "",
                            Created = channel.Created,
                            Subscribes = channel.Subscribes.Count,
                            IconUrl = $"/channels/{channel.Id}/icon.{channelLocalData.IconExtention}",
                            HeaderUrl = $"/channels/{channel.Id}/banner.{channelLocalData.HeaderExtention}"
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
