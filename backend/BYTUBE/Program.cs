using BYTUBE.Middleware;
using BYTUBE.Models;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

        builder.Services.AddSingleton(new JwtManager(jwtSettings));

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
                var key = Encoding.ASCII.GetBytes(jwtSettings.SecretKey);

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });



        // Add services to the container.

        builder.Services.AddControllers();

        string connectionString = builder.Configuration.GetConnectionString("DefaultConnection0");

        builder.Services.AddDbContext<PostgresDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        var app = builder.Build();

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