using Microsoft.EntityFrameworkCore;

internal class Program
{


    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDistributedMemoryCache();

        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(30);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
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

        app.UseStaticFiles();

        app.UseSession();

        app.MapControllers();

        app.Run();
    }
}