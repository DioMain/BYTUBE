using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly PostgresDbContext _db;
        private readonly LocalDataService _localDataManager;

        public ChannelController(PostgresDbContext db, LocalDataService localDataManager)
        {
            _db = db;
            _localDataManager = localDataManager;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid cGuid))
                    throw new ServerException("Channel id is not correct!");

                Channel? channel = await _db.Channels
                    .Include(i => i.Subscribes)
                    .FirstOrDefaultAsync(i => i.Id == cGuid) 
                    ?? throw new ServerException("Не найден подходящий канал", 404);

                var localData = _localDataManager.GetChannelData(cGuid);

                bool isSubscribed = false;

                if (authData.IsAutorize)
                    isSubscribed = channel.Subscribes.Any(i => i.UserId == authData.Id);

                return Results.Json(new ChannelFullModel()
                {
                    Id = cGuid.ToString(),
                    Name = channel.Name,
                    Description = channel.Description!,
                    Subscribes = channel.Subscribes.Count,
                    IsSubscripted = isSubscribed,
                    IconUrl = $"/data/channels/{id}/icon.{localData.IconExtention}",
                    BannerUrl = $"/data/channels/{id}/banner.{localData.BannerExtention}",
                });
            }
            catch (ServerException srvError)
            {
                return Results.Json(srvError.GetModel(), statusCode: srvError.Code);
            }
        }

        [HttpGet("check"), Authorize]
        public async Task<IResult> CheckChannel([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Channel? channel = await _db.Channels.Include(i => i.Subscribes)
                                         .FirstOrDefaultAsync(i => i.Id == guid && i.UserId == authData.Id);

                if (channel == null)
                    throw new ServerException("Не найден подходящий канал", 401);

                var localData = _localDataManager.GetChannelData(guid);

                return Results.Json(new ChannelFullModel()
                {
                    Id = id,
                    Name = channel.Name,
                    Description = channel.Description!,
                    Subscribes = channel.Subscribes.Count,
                    IconUrl = $"/data/channels/{id}/icon.{localData.IconExtention}",
                    BannerUrl = $"/data/channels/{id}/banner.{localData.BannerExtention}",
                });
            }
            catch (ServerException srvError)
            {
                return Results.Json(srvError.GetModel(), statusCode: srvError.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateChannelModel model)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Channel cur = (await _db.Channels.AddAsync(new Channel()
                {
                    Name = model.Name,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    UserId = authData.Id,
                })).Entity;

                await _db.SaveChangesAsync();

                await _localDataManager.SaveChannelFiles(cur.Id, model.IconFile!, model.BannerFile!);

                return Results.Ok();
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromForm] EditChannelModel model, [FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == guid);

                if (channel == null)
                    throw new ServerException("Канал не найден!", 404);

                if (channel.UserId != authData.Id)
                    throw new ServerException("Канал вам не пренадлежит!", 403);

                channel.Name = model.Name;
                channel.Description = model.Description;

                _db.Channels.Update(channel);

                await _db.SaveChangesAsync();

                await _localDataManager.SaveChannelFiles(guid, model.IconFile, model.BannerFile, true);

                return Results.Ok();
            }

            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == guid);

                if (channel == null)
                    throw new ServerException("Канал не найден!", 404);

                if (channel.UserId != authData.Id)
                    throw new ServerException("Канал вам не пренадлежит!", 403);

                foreach (var video in _db.Videos.Where(i => i.OwnerId == channel.Id))
                {
                    Directory.Delete($"{LocalDataService.VideosPath}/{video.Id}", true);

                    _db.Videos.Remove(video);
                }

                Directory.Delete($"{LocalDataService.ChannelsPath}/{guid}", true);

                _db.Channels.Remove(channel);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }

            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }

        [HttpGet("user"), Authorize]
        public async Task<IResult> GetUserChannels()
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Channel[] channels = await _db.Channels
                    .Include(i => i.Subscribes)
                    .Where(i => i.Subscribes.Any(subs => subs.UserId == authData.Id))
                    .ToArrayAsync();

                return Results.Json(channels.Select(channel =>
                {
                    var localData = _localDataManager.GetChannelData(channel.Id);

                    return new ChannelModel()
                    {
                        Id = channel.Id.ToString(),
                        Name = channel.Name,
                        Subscribes = channel.Subscribes.Count,
                        IsSubscripted = true,
                        IconUrl = $"/data/channels/{channel.Id}/icon.{localData.IconExtention}",
                    };
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("subscribe"), Authorize]
        public async Task<IResult> Subscribe([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == guid);

                if (channel == null)
                    throw new ServerException("Канал не найден", 404);

                if (await _db.Subscriptions.AnyAsync(i => i.UserId == authData.Id && i.ChannelId == guid))
                    throw new ServerException("Уже подписан");

                await _db.Subscriptions.AddAsync(new Subscribe()
                {
                    UserId = authData.Id,
                    ChannelId = channel.Id,
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete("subscribe"), Authorize]
        public async Task<IResult> Unsubscribe([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Channel? channel = await _db.Channels.FindAsync(guid)
                    ?? throw new ServerException("Канал не найден", 404);

                Subscribe? subscribe = await _db.Subscriptions
                    .FirstOrDefaultAsync(i => i.UserId == authData.Id && i.ChannelId == guid);

                if (subscribe == null)
                    throw new ServerException("Не подписан");

                _db.Subscriptions.Remove(subscribe);

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
