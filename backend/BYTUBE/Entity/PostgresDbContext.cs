using BYTUBE.Entity.Models;
using BYTUBE.Services;
using Microsoft.EntityFrameworkCore;
using NAudio.CoreAudioApi;
using System.Xml.Linq;

public class PostgresDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<Subscribe> Subscriptions { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<PlaylistItem> PlaylistItems { get; set; }

    public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        InsertData(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }

    private static async void InsertData(ModelBuilder builder)
    {
        LocalDataManager dataManager = new LocalDataManager();

        PasswordHasher hasher = new PasswordHasher("BYTUBE");

        builder.Entity<User>().HasData(new User()
        {
            Id = 1,
            Role = User.RoleType.Admin,
            Name = "ADMIN",
            Email = "ADMIN@mail.com",
            Password = hasher.Hash("Pravoda01")
        },
        new User()
        {
            Id = 2,
            Role = User.RoleType.Admin,
            Name = "DataGenerator",
            Email = "Generator@mail.com",
            Password = hasher.Hash("123456")
        });

        builder.Entity<Channel>().HasData(new Channel()
        {
            Id = 1,
            UserId = 2,
            Name = "DataGenerator",
            Created = DateTime.UtcNow,
            Description = "DataGeneratorChannel",
        });

        if (!Directory.Exists("./Data/users/1"))
            await dataManager.SaveUserFiles(1, null);
        if (!Directory.Exists("./Data/users/2"))
            await dataManager.SaveUserFiles(2, null);

        if (!Directory.Exists("./Data/channels/1"))
            await dataManager.SaveChannelFiles(1, null, null);
    }
}