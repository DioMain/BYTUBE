using BYTUBE.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Services
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext, 
            Exception exception, 
            CancellationToken cancellationToken)
        {
            Console.WriteLine($"EXCEPTION: {exception.GetType().Name}\nMESSAGE: {exception.Message}");

            httpContext.Response.ContentType = "application/json";

            switch (exception)
            {
                case ServerException serverErr:
                    httpContext.Response.StatusCode = serverErr.Code;

                    await httpContext.Response.WriteAsJsonAsync(serverErr.GetModel());
                    break;
                default:
                    httpContext.Response.StatusCode = 500;

                    await httpContext.Response.WriteAsJsonAsync(new ProblemDetails()
                    {
                        Status = 500,
                        Detail = $"Internal Server Error: {exception.Message}"
                    });
                    break;
            }

            return true;
        }
    }
}
