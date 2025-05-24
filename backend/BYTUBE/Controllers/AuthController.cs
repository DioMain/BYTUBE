using Microsoft.AspNetCore.Mvc;
using BYTUBE.Services;
using BYTUBE.Models;
using BYTUBE.Exceptions;
using Microsoft.EntityFrameworkCore;
using BYTUBE.Models.AuthModels;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtManager;
        private readonly PasswordHasherService _passwordHasher;
        private readonly PostgresDbContext _db;
        private readonly LocalDataService _localDataManager;

        public AuthController(JwtService jwtManager, PasswordHasherService passwordHasher, PostgresDbContext db, LocalDataService localDataManager)
        {
            _jwtManager = jwtManager;
            _passwordHasher = passwordHasher;
            _db = db;
            _localDataManager = localDataManager;
        }

        [HttpPost("signin")]
        public async Task<IResult> SignIn([FromBody] SigninModel model)
        {
            try
            {
                var user = await _db.Users.FirstAsync(i => i.Email == model.Email);

                if (!_passwordHasher.Verify(model.Password, user.Password))
                {
                    throw new ServerException("Пароли не совпадают");
                }

                HttpContext.Response.Cookies.Append(
                    "AccessToken",
                    JwtService.GenerateJwtToken(_jwtManager.AccessToken, new() { Id = user.Id, Role = user.Role}),
                    _jwtManager.JwtCookieOptions
                );

                string token = JwtService.GenerateJwtToken(_jwtManager.RefreshToken, new() { Id = user.Id, Role = user.Role });

                HttpContext.Response.Cookies.Append(
                    "RefreshToken",
                    token,
                    _jwtManager.JwtCookieOptions
                );

                user.Token = token;

                _db.Users.Update(user);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException apperr)
            {
                return Results.Json(apperr.GetModel(), statusCode: apperr.Code);
            }
        }

        [HttpGet("signout")]
        public IResult Logout()
        {
            HttpContext.Response.Cookies.Delete("AccessToken");
            HttpContext.Response.Cookies.Delete("RefreshToken");

            return Results.Ok();
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromForm] RegisterModel model)
        {
            try
            {
                var usr = await _db.Users.AddAsync(new()
                {
                    Name = model.UserName,
                    Email = model.Email,
                    Password = _passwordHasher.Hash(model.Password),
                    Role = Entity.Models.User.RoleType.User,
                    BirthDay = DateOnly.Parse(model.BirthDay)
                });

                await _db.SaveChangesAsync();

                await _localDataManager.SaveUserFiles(usr.Entity.Id, model.ImageFile);
            }
            catch
            {
                var errorModel = new ServerErrorModel(400);
                errorModel.errors.Add("email", ["Пользователь с такой почтой уже сущетсвует"]);

                return Results.Json(errorModel, statusCode: 400);
            }

            return Results.Ok();
        }
    }
}
