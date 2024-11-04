using BYTUBE.Entity.Models;
using BYTUBE.Models;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.UserModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgresDbContext _db;
        private readonly LocalDataManager _localDataManager;

        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);

        public UserController(PostgresDbContext db, LocalDataManager localDataManager)
        {
            _db = db;
            _localDataManager = localDataManager;
        }   

        [HttpGet("geticon")]
        public IResult GetUserIcon([FromQuery] string email)
        {
            string imgUrl = "";

            try
            {
                var usr = _db.Users.First(i => i.Email == email);
                var ext = _localDataManager.GetUserData(usr.Id).IconExtention;

                imgUrl = $"/data/users/{usr.Id}/icon.{ext}";
            }
            catch
            {
                var srvError = new ServerErrorModel(404, "User not found!");
                srvError.errors.Add("User", ["Пользователь с такой почтой не найден"]);

                return Results.Json(srvError, statusCode: 404);
            }

            return Results.Json(imgUrl);
        }

        [HttpGet("auth"), Authorize]
        public IResult Auth()
        {
            try
            {
                var user = _db.Users.First(i => i.Id == UserId);
                var iconExt = _localDataManager.GetUserData(user.Id).IconExtention;

                return Results.Json(new UserPrivateModel()
                {
                    Email = user.Email,
                    Name = user.Name,
                    Id = UserId,
                    Role = user.Role,
                    IconUrl = $"/data/users/{user.Id}/icon.{iconExt}",
                });
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }

        [HttpGet("channelslist"), Authorize]
        public async Task<IResult> GetChannelsList()
        {
            try
            {
                Channel[] channels = [.. await _db.Channels.Where(i => i.UserId == UserId).ToArrayAsync()];

                return Results.Json(channels.Select(item =>
                {
                    string iconEx = _localDataManager.GetChannelData(item.Id).IconExtention;

                    return new ChannelModel()
                    {
                        Id = item.Id,
                        Name = item.Name,
                        IconUrl = $"/data/channels/{item.Id}/icon.{iconEx}"
                    };
                }));
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }
    }
}
