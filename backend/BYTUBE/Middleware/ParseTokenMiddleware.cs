using BYTUBE.Entity.Models;
using BYTUBE.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BYTUBE.Middleware
{
    public class ParseTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtService _jwtService;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public ParseTokenMiddleware(RequestDelegate next, JwtService jwtManager, IServiceScopeFactory serviceScopeFactory)
        {
            _next = next;
            _jwtService = jwtManager;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public Task Invoke(HttpContext httpContext)
        {
            string? access = httpContext.Request.Cookies["AccessToken"];
            string? refresh = httpContext.Request.Cookies["RefreshToken"];

            if (refresh == null || string.IsNullOrEmpty(refresh))
                return _next(httpContext);

            ClaimsPrincipal? refreshJwtClaims = JwtService.ValidateToken(refresh, JwtService.GetParameters(_jwtService.RefreshToken));

            if (refreshJwtClaims == null)
                return _next(httpContext);

            var claims = refreshJwtClaims.Claims.Select(i => new { i.Type, i.Value }).ToList();

            if (!Guid.TryParse(claims[0].Value, out Guid userId))
                return _next(httpContext);

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var dbContect = scope.ServiceProvider.GetRequiredService<PostgresDbContext>();

                var user = dbContect.Users.Find(userId);

                if (user == null)
                    return _next(httpContext);

                if (user.Token != refresh)
                    return _next(httpContext);
            }

            ClaimsPrincipal? accessJwtClaims = JwtService.ValidateToken(access, JwtService.GetParameters(_jwtService.AccessToken));

            if (access == null || string.IsNullOrEmpty(access) || accessJwtClaims == null)
            {
                access = JwtService.GenerateJwtToken(_jwtService.AccessToken, new()
                {
                    Id = userId,
                    Role = Enum.Parse<User.RoleType>(claims[1].Value)
                });

                httpContext.Response.Cookies.Append("AccessToken", access);
            }

            httpContext.Request.Headers.Append("Authorization", $"Bearer {access}");

            return _next(httpContext);
        }
    }

    public static class ParseTokenExtensions
    {
        public static IApplicationBuilder UseParseToken(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ParseTokenMiddleware>();
        }
    }
}
