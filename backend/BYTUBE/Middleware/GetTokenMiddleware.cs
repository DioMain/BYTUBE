using BYTUBE.Entity.Models;
using BYTUBE.Services;
using System.Security.Claims;

namespace BYTUBE.Middleware
{
    public class GetTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtManager _jwtManager;

        public GetTokenMiddleware(RequestDelegate next, JwtManager jwtManager)
        {
            _next = next;
            _jwtManager = jwtManager;
        }

        public Task Invoke(HttpContext httpContext)
        {
            string? access = httpContext.Request.Cookies["AccessToken"];
            string? refresh = httpContext.Request.Cookies["RefreshToken"];

            if (refresh == null || string.IsNullOrEmpty(refresh))
                return _next(httpContext);

            ClaimsPrincipal? refreshJwtClaims = JwtManager.ValidateToken(refresh, JwtManager.GetParameters(_jwtManager.RefreshToken));

            if (refreshJwtClaims == null)
                return _next(httpContext);

            var claims = refreshJwtClaims.Claims.Select(i => new { i.Type, i.Value }).ToList();

            ClaimsPrincipal? accessJwtClaims = JwtManager.ValidateToken(access, JwtManager.GetParameters(_jwtManager.AccessToken));

            if (access == null || string.IsNullOrEmpty(access) || accessJwtClaims == null)
            {
                access = JwtManager.GenerateJwtToken(_jwtManager.AccessToken, new User()
                {
                    Id = int.Parse(claims[0].Value),
                    Role = Enum.Parse<User.RoleType>(claims[1].Value)
                });

                httpContext.Response.Cookies.Append("AccessToken", access);
            }

            httpContext.Request.Headers.Append("Authorization", $"Bearer {access}");

            return _next(httpContext);
        }
    }

    public static class GetTokenExtensions
    {
        public static IApplicationBuilder UseGetToken(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GetTokenMiddleware>();
        }
    }
}
