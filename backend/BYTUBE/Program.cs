using BYTUBE.Middleware;
using BYTUBE.Models;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var accessToken = builder.Configuration.GetSection("AccessToken").Get<JwtSettings>();
        var refreshToken = builder.Configuration.GetSection("RefreshToken").Get<JwtSettings>();
        var salt = builder.Configuration["Salt"];

        builder.Services.AddSingleton(new JwtManager(accessToken!, refreshToken!));
        builder.Services.AddSingleton(new PasswordHasher(salt!));

        builder.Services.AddDistributedMemoryCache();

        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(30);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
        });

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = JwtManager.GetParameters(accessToken);
            });

        builder.Services.AddControllers();

        string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<PostgresDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        var app = builder.Build();

        if (!Directory.Exists("./Uploads"))
            Directory.CreateDirectory("./Uploads");

        // Configure the HTTP request pipeline.

        app.UseHttpsRedirection();

        app.UseGetToken();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseStaticFiles();

        app.UseSession();

        app.MapControllers();

        app.Run();
    }
}