using Microsoft.AspNetCore.Mvc;
using BYTUBE.Services;
using BYTUBE.Models;
using System.IO;
using Npgsql;
using BYTUBE.Exceptions;

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
        public IResult signinJwt([FromBody] SigninModel model)
        {
            try
            {
                var user = _db.Users.First(i => i.Email == model.Email);

                if (!_passwordHasher.Verify(model.Password, user.Password))
                {
                    throw new ServerException("Пароли не совпадают");
                }

                HttpContext.Response.Cookies.Append(
                    "AccessToken",
                    JwtManager.GenerateJwtToken(_jwtManager.AccessToken, user.Id.ToString()),
                    _jwtManager.JwtCookieOptions
                );

                HttpContext.Response.Cookies.Append(
                    "RefreshToken",
                    JwtManager.GenerateJwtToken(_jwtManager.RefreshToken, user.Id.ToString()),
                    _jwtManager.JwtCookieOptions
                );
            }
            catch (ServerException apperr)
            {
                return Results.Json(apperr.GetModel(), statusCode: apperr.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }

            return Results.Ok();
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

                string imgEx = model.ImageFile?.FileName.Split('.').Last();

                string userImgPath = $"./wwwroot/users/{usr.Entity.Id}/icon.{imgEx}";
                string uploadImgPath = $"./Uploads/img.{imgEx}";

                Directory.CreateDirectory($"./wwwroot/users/{usr.Entity.Id}");

                if (model.ImageFile != null)
                {
                    using (var stream = new FileStream(uploadImgPath, FileMode.Create))
                    {
                        await model.ImageFile.CopyToAsync(stream);
                    }

                    _localDataManager.SetUserData(usr.Entity.Id, new LocalDataManager.UserData()
                    {
                        IconExtention = imgEx!
                    });

                    System.IO.File.Copy(uploadImgPath, userImgPath);
                    System.IO.File.Delete(uploadImgPath);
                }
                else
                {
                    _localDataManager.SetUserData(usr.Entity.Id, new LocalDataManager.UserData()
                    {
                        IconExtention = "png"
                    });

                    System.IO.File.Copy("./wwwroot/users/template/icon.png", userImgPath);
                }
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
