using Microsoft.AspNetCore.Mvc;
using BYTUBE.Services;
using BYTUBE.Models;
using BYTUBE.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtManager _jwtManager;
        private readonly PasswordHasher _passwordHasher;
        private readonly PostgresDbContext _db;
        private readonly LocalDataManager _localDataManager;

        public AuthController(JwtManager jwtManager, PasswordHasher passwordHasher, PostgresDbContext db, LocalDataManager localDataManager)
        {
            _jwtManager = jwtManager;
            _passwordHasher = passwordHasher;
            _db = db;
            _localDataManager = localDataManager;
        }

        [HttpPost("signin")]
        public async Task<IResult> signinJwt([FromBody] SigninModel model)
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
                    JwtManager.GenerateJwtToken(_jwtManager.AccessToken, user),
                    _jwtManager.JwtCookieOptions
                );

                string token = JwtManager.GenerateJwtToken(_jwtManager.RefreshToken, user);

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
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }
        }

        [HttpGet("signout")]
        public IResult logoutJwt()
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
                    Password = _passwordHasher.Hash(model.Password)
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
