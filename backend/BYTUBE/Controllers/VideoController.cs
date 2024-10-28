using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
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

        public VideoController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                Video? videoData = await _db.Videos.FirstOrDefaultAsync(i => i.Id == i.Id);

                if (videoData == null)
                    throw new ServerException("Видео не найдено", 404);

                Channel channel = await _db.Channels.FirstAsync(i => i.Id == videoData.OwnerId);

                VideoModel videoModel = new VideoModel()
                {
                    Id = videoData.Id,
                    Title = videoData.Title,
                    Description = videoData.Description ?? "",
                    Duration = videoData.Duration,
                    Created = videoData.Created,
                    Views = videoData.Views,
                    Tags = videoData.Tags,
                    Channel = new ChannelModel()
                    {
                        Id = channel.Id,
                        Name = channel.Name,
                        Description = channel.Description ?? "",
                        Created = channel.Created
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
                Video[] videoDatas = [.. await _db.Videos.Skip(skip).Take(take).OrderBy(i => i.Id).Include(i => i.Owner).ToArrayAsync()];

                VideoModel[] models = videoDatas.Select(videoData =>
                {
                    Channel channel = videoData.Owner;

                    return new VideoModel()
                    {
                        Id = videoData.Id,
                        Title = videoData.Title,
                        Description = videoData.Description ?? "",
                        Duration = videoData.Duration,
                        Created = videoData.Created,
                        Views = videoData.Views,
                        Tags = videoData.Tags,
                        Channel = new ChannelModel()
                        {
                            Id = channel.Id,    
                            Name = channel.Name,
                            Description = channel.Description ?? "",
                            Created = channel.Created
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
