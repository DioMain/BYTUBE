using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Google;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtManager _jwtManager;

        private readonly CookieOptions _jwtCookieOptions;

        public AuthController(JwtManager jwtManager)
        {
            _jwtManager = jwtManager;

            _jwtCookieOptions = new CookieOptions()
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                MaxAge = TimeSpan.FromMinutes(5)
            };
        }

        [HttpGet("signin-jwt")]
        public IResult loginJwt()
        {
            HttpContext.Response.Cookies.Append("Authorization", $"Bearer {_jwtManager.GenerateJwtToken("TestUser")}", _jwtCookieOptions);

            return Results.Redirect("/App");
        }

        [HttpGet("signout-jwt")]
        public IResult logoutJwt()
        {
            HttpContext.Response.Cookies.Delete("Authorization");

            return Results.Redirect("/App");
        }

        [HttpGet("secret-jwt"), Authorize]
        public IResult secretJwt()
        {
            return Results.Text("Secret", "text/plain");
        }
    }
}
