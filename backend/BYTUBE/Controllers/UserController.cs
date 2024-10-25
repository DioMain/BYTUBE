using BYTUBE.Models;
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
    }
}
