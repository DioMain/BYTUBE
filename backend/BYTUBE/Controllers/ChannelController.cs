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
        public IResult Get()
        {
            return Results.Ok();
        }

        [HttpGet("check"), Authorize]
        public async Task<IResult> GetChannel([FromQuery] int id)
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
                    IconUrl = $"/channels/{id}/icon.{localData.IconExtention}",
                    BannerUrl = $"/channels/{id}/banner.{localData.BannerExtention}",
                });
            }
            catch (ServerException srvError)
            {
                return Results.Json(srvError.GetModel(), statusCode: srvError.Code);
            }
        }



        [HttpPost, Authorize]
        public async Task<IResult> CreateNew([FromForm] CreateChannelModel model)
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

                string iconEx = model.IconFile?.FileName.Split('.').Last();
                string bannerEx = model.BannerFile?.FileName.Split('.').Last();

                string iconNewPath = $"./wwwroot/channels/{cur.Id}/icon.{iconEx}";
                string iconUploadPath = $"./Uploads/iimg.{iconEx}";

                string bannerNewPath = $"./wwwroot/channels/{cur.Id}/banner.{bannerEx}";
                string bannerUploadPath = $"./Uploads/bimg.{bannerEx}";

                Directory.CreateDirectory($"./wwwroot/channels/{cur.Id}");

                using (var stream = new FileStream(iconUploadPath, FileMode.Create))
                {
                    await model.IconFile?.CopyToAsync(stream)!;
                }

                System.IO.File.Copy(iconUploadPath, iconNewPath);
                System.IO.File.Delete(iconUploadPath);

                using (var stream = new FileStream(bannerUploadPath, FileMode.Create))
                {
                    await model.BannerFile?.CopyToAsync(stream)!;
                }

                System.IO.File.Copy(bannerUploadPath, bannerNewPath);
                System.IO.File.Delete(bannerUploadPath);

                _localDataManager.SetChannelData(cur.Id, new LocalDataManager.ChannelData()
                {
                    IconExtention = iconEx!,
                    BannerExtention = bannerEx!,
                });

                return Results.Ok();
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }
    }
}
