using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
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
        private readonly LocalDataManager _localDataManager;

        private bool IsAutorize => HttpContext.User.Claims.Any();
        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);

        public ChannelController(PostgresDbContext db, LocalDataManager localDataManager)
        {
            _db = db;
            _localDataManager = localDataManager;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels
                    .Include(i => i.Subscribes)
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == UserId);

                if (channel == null)
                    throw new ServerException("Не найден подходящий канал", 404);

                var localData = _localDataManager.GetChannelData(id);

                bool isSubscribed = false;

                if (IsAutorize)
                    isSubscribed = channel.Subscribes.Any(i => i.UserId == UserId);

                return Results.Json(new ChannelFullModel()
                {
                    Id = id,
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
        public async Task<IResult> CheckChannel([FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels.Include(i => i.Subscribes)
                                         .FirstOrDefaultAsync(i => i.Id == id && i.UserId == UserId);

                if (channel == null)
                    throw new ServerException("Не найден подходящий канал", 401);

                var localData = _localDataManager.GetChannelData(id);

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
                Channel cur = (await _db.Channels.AddAsync(new Channel()
                {
                    Name = model.Name,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    UserId = UserId,
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
        public async Task<IResult> Put([FromForm] EditChannelModel model, [FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == id);

                if (channel == null)
                    throw new ServerException("Канал не найден!", 404);

                if (channel.UserId != UserId)
                    throw new ServerException("Канал вам не пренадлежит!", 403);

                channel.Name = model.Name;
                channel.Description = model.Description;

                _db.Channels.Update(channel);

                await _db.SaveChangesAsync();

                await _localDataManager.SaveChannelFiles(id, model.IconFile, model.BannerFile, true);

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
        public async Task<IResult> Delete([FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == id);

                if (channel == null)
                    throw new ServerException("Канал не найден!", 404);

                if (channel.UserId != UserId)
                    throw new ServerException("Канал вам не пренадлежит!", 403);

                foreach (var video in _db.Videos.Where(i => i.OwnerId == channel.Id))
                {
                    Directory.Delete($"{LocalDataManager.VideosPath}/{video.Id}", true);

                    _db.Videos.Remove(video);
                }

                Directory.Delete($"{LocalDataManager.ChannelsPath}/{id}", true);

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
                Channel[] channels = await _db.Channels
                    .Include(i => i.Subscribes)
                    .Where(i => i.Subscribes.Any(subs => subs.UserId == UserId))
                    .ToArrayAsync();

                return Results.Json(channels.Select(channel =>
                {
                    var localData = _localDataManager.GetChannelData(channel.Id);

                    return new ChannelModel()
                    {
                        Id = channel.Id,
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
        public async Task<IResult> Subscribe([FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == id);

                if (channel == null)
                    throw new ServerException("Канал не найден", 404);

                if (await _db.Subscriptions.AnyAsync(i => i.UserId == UserId && i.ChannelId == id))
                    throw new ServerException("Уже подписан");

                await _db.Subscriptions.AddAsync(new Subscribe()
                {
                    UserId = UserId,
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
        public async Task<IResult> Unsubscribe([FromQuery] int id)
        {
            try
            {
                Channel? channel = await _db.Channels.FirstOrDefaultAsync(c => c.Id == id);

                if (channel == null)
                    throw new ServerException("Канал не найден", 404);

                Subscribe? subscribe = await _db.Subscriptions
                    .FirstOrDefaultAsync(i => i.UserId == UserId && i.ChannelId == id);

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
