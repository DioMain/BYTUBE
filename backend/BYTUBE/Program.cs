using BYTUBE.Helpers;
using BYTUBE.Middleware;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Npgsql;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var accessToken = builder.Configuration.GetSection("AccessToken").Get<JwtSettings>();
        var refreshToken = builder.Configuration.GetSection("RefreshToken").Get<JwtSettings>();
        var salt = builder.Configuration["Salt"];
        var ffmpegPath = builder.Configuration["FFMpegPath"];

        Console.WriteLine(ffmpegPath);

        builder.Services.AddSingleton(new JwtService(accessToken!, refreshToken!));
        builder.Services.AddSingleton(new PasswordHasherService(salt!));
        builder.Services.AddSingleton(new LocalDataService());
        builder.Services.AddSingleton(new VideoMediaService(ffmpegPath!));

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
                options.TokenValidationParameters = JwtService.GetParameters(accessToken);
            });

        builder.Services.AddControllers();

        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = long.MaxValue;
        });

        builder.WebHost.ConfigureKestrel(options =>
        {
            options.Limits.MaxRequestBodySize = long.MaxValue;
        });

        // DataSource

        string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.EnableDynamicJson();

        var dataSource = dataSourceBuilder.Build();
        builder.Services.AddSingleton(dataSource);

        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<PostgresDbContext>(options =>
        {
            options.UseNpgsql(dataSource);
        });

        // DataSource

        var app = builder.Build();

        // Configure the HTTP request pipeline.

        app.UseHttpsRedirection();

        app.UseParseToken();

        app.UseAuthentication();
        app.UseAuthorization();

        Console.WriteLine(Directory.GetCurrentDirectory());

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
            RequestPath = ""
        });
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "Data")),
            RequestPath = "/data"
        });

        app.UseSession();

        app.MapControllers();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.Run();
    }
}