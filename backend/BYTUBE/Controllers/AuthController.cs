using Microsoft.AspNetCore.Mvc;
using BYTUBE.Services;
using BYTUBE.Models;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtManager _jwtManager;
        private readonly PasswordHasher _passwordHasher;
        private readonly PostgresDbContext _db;

        public AuthController(JwtManager jwtManager, PasswordHasher passwordHasher, PostgresDbContext db)
        {
            _jwtManager = jwtManager;
            _passwordHasher = passwordHasher;
            _db = db;
        }

        [HttpGet("signin-jwt")]
        public IResult loginJwt()
        {
            HttpContext.Response.Cookies.Append(
                "AccessToken", 
                JwtManager.GenerateJwtToken(_jwtManager.AccessToken, "TestUser"), 
                _jwtManager.JwtCookieOptions
            );

            HttpContext.Response.Cookies.Append(
                "RefreshToken", 
                JwtManager.GenerateJwtToken(_jwtManager.RefreshToken, "TestUser"), 
                _jwtManager.JwtCookieOptions
            );

            return Results.Redirect("/App");
        }

        [HttpGet("signout-jwt")]
        public IResult logoutJwt()
        {
            HttpContext.Response.Cookies.Delete("AccessToken");
            HttpContext.Response.Cookies.Delete("RefreshToken");

            return Results.Redirect("/App");
        }

        [HttpPost("register")]
        public IResult Register([FromBody] RegisterModel model)
        {
            return Results.Ok();
        }
    }
}
