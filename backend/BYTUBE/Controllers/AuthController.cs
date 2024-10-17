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

        public AuthController(JwtManager jwtManager)
        {
            _jwtManager = jwtManager;
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

        [HttpGet("secret-jwt"), Authorize]
        public IResult secretJwt()
        {
            return Results.Text("Secret", "text/plain");
        }
    }
}
