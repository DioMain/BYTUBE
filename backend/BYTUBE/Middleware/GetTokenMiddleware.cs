namespace BYTUBE.Middleware
{
    public class GetTokenMiddleware
    {
        private readonly RequestDelegate _next;

        public GetTokenMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
            string? token = httpContext.Request.Cookies["Authorization"];

            if (token != null && !string.IsNullOrEmpty(token))
                httpContext.Request.Headers.Append("Authorization", token);

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
