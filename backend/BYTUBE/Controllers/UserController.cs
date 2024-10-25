using BYTUBE.Models;
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

        public UserController(PostgresDbContext db)
        {
            _db = db;
        }   

        [HttpGet("geticon")]
        public IResult GetUserIcon([FromQuery] string email)
        {
            string imgUrl = "";

            try
            {
                var usr = _db.Users.First(i => i.Email == email);

                imgUrl = $"/users/{usr.Id}/icon.png";
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

                return Results.Json(new UserModel()
                {
                    Email = user.Email,
                    Name = user.Name,
                    Id = id,
                    Role = user.Role,
                });
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message);
            }
        }
    }
}
