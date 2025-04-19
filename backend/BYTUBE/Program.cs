using BYTUBE.Helpers;
using BYTUBE.Hubs;
using BYTUBE.Middleware;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Npgsql;
using System;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var accessToken = builder.Configuration.GetSection("AccessToken").Get<JwtSettings>();
        var refreshToken = builder.Configuration.GetSection("RefreshToken").Get<JwtSettings>();
        var salt = builder.Configuration["Salt"];
        var ffmpegPath = builder.Configuration["FFMpegPath"];

        const string w2gPath = "/WatchTogetherHub";

        Console.WriteLine(ffmpegPath);

        builder.Services.AddSingleton(new JwtService(accessToken!, refreshToken!));
        builder.Services.AddSingleton(new PasswordHasherService(salt!));
        builder.Services.AddSingleton(new LocalDataService());
        builder.Services.AddSingleton(new VideoMediaService(ffmpegPath!));
        builder.Services.AddSingleton(new WatchTogetherLobbyService());
        builder.Services.AddHostedService<WatchTogetherLobbyCleaningService>();

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

                options.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Cookies["AccessToken"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments(w2gPath))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
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
            options.EnableSensitiveDataLogging(false);
        });

        // FOR DEBUG
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials()
                      .SetIsOriginAllowed(origin => true);
            });
        });

        builder.Services.AddSignalR();

        // DataSource

        var app = builder.Build();

        app.UseHttpsRedirection();

        app.UseParseToken();

        app.UseAuthentication();
        app.UseAuthorization();

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

        // FOR DEBUG
        app.UseCors();

        app.MapControllers();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.MapHub<WatchTogetherHub>(w2gPath);

        app.Run();
    }
}