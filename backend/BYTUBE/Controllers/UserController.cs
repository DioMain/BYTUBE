using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
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
        private readonly LocalDataService _localDataManager;

        public UserController(PostgresDbContext db, LocalDataService localDataManager)
        {
            _db = db;
            _localDataManager = localDataManager;
        }   

        [HttpGet("geticon")]
        public async Task<IResult> GetUserIcon([FromQuery] string email)
        {
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(i => i.Email == email)
                    ?? throw new ServerException("Пользователь не найден");

                var userLocalData = _localDataManager.GetUserData(user.Id);

                string imgUrl = $"/data/users/{user.Id}/icon.{userLocalData.IconExtention}";

                return Results.Json(imgUrl);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("auth"), Authorize]
        public async Task<IResult> Auth()
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                var user = await _db.Users.FindAsync(authData.Id)
                    ?? throw new ServerException("Пользователь не найден");

                var iconExt = _localDataManager.GetUserData(user.Id).IconExtention;

                return Results.Json(new UserPrivateModel()
                {
                    Email = user.Email,
                    Name = user.Name,
                    Id = authData.Id.ToString(),
                    Role = user.Role,
                    BirthDay = user.BirthDay.ToString("o"),
                    IconUrl = $"/data/users/{user.Id}/icon.{iconExt}",
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("channelslist"), Authorize]
        public async Task<IResult> GetChannelsList()
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Channel[] channels = [.. await _db.Channels.Where(i => i.UserId == authData.Id).ToArrayAsync()];

                return Results.Json(channels.Select(item =>
                {
                    string iconEx = _localDataManager.GetChannelData(item.Id).IconExtention;

                    return new ChannelModel()
                    {
                        Id = item.Id.ToString(),
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
