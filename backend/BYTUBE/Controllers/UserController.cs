using BYTUBE.Entity.Models;
using BYTUBE.Models;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PostgresDbContext _db;
        private readonly LocalDataManager _localDataManager;

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

                imgUrl = $"/users/{usr.Id}/icon.{ext}";
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
            int id = int.Parse(HttpContext.User.Claims.ToArray()[0].Value);

            try
            {
                var user = _db.Users.First(i => i.Id == id);
                var iconExt = _localDataManager.GetUserData(user.Id).IconExtention;

                return Results.Json(new UserModel()
                {
                    Email = user.Email,
                    Name = user.Name,
                    Id = id,
                    Role = user.Role,
                    IconUrl = $"/users/{user.Id}/icon.{iconExt}",
                });
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }
    }
}
