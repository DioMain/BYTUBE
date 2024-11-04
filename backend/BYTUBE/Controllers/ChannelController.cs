using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
                Channel? channel = await _db.Channels.FirstOrDefaultAsync(i => i.Id == id && i.UserId == UserId);

                if (channel == null)
                    throw new ServerException("Не найден подходящий канал", 404);

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
    }
}
