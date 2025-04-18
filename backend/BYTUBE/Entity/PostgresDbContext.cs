using BYTUBE.Entity.Models;
using BYTUBE.Services;
using Microsoft.EntityFrameworkCore;
using NAudio.CoreAudioApi;
using System.Globalization;
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
    public DbSet<VideoMark> VideoMarks { get; set; }

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
        LocalDataService dataManager = new LocalDataService();
        PasswordHasherService hasher = new PasswordHasherService("BYTUBE");

        Guid userGuid1 = Guid.Parse("cda93124-d3cc-4e11-b529-8c0c4078835c");
        Guid userGuid2 = Guid.Parse("73ef0c94-ac5a-4414-af7f-7fbdb40a9795");

        Guid channelGuid = Guid.Parse("7dc1efc5-688a-499f-8638-0caaf0539616");

        builder.Entity<User>().HasData(new User()
        {
            Id = userGuid1,
            Role = User.RoleType.Admin,
            Name = "ADMIN",
            Email = "ADMIN@mail.com",
            Password = hasher.Hash("Pravoda01"),
            BirthDay = DateOnly.ParseExact("16.04.2004", "dd.MM.yyyy", CultureInfo.InvariantCulture)
        },
        new User()
        {
            Id = userGuid2,
            Role = User.RoleType.User,
            Name = "DataGenerator",
            Email = "Generator@mail.com",
            Password = hasher.Hash("123456"),
            BirthDay = DateOnly.ParseExact("16.04.2004", "dd.MM.yyyy", CultureInfo.InvariantCulture)
        });

        builder.Entity<Channel>().HasData(new Channel()
        {
            Id = channelGuid,
            UserId = userGuid2,
            Name = "DataGenerator",
            Created = DateTime.UtcNow,
            Description = "DataGeneratorChannel",
        });

        if (!Directory.Exists($"./Data/users/{userGuid1}"))
            await dataManager.SaveUserFiles(userGuid1, null);
        if (!Directory.Exists($"./Data/users/{userGuid2}"))
            await dataManager.SaveUserFiles(userGuid2, null);

        if (!Directory.Exists($"./Data/channels/{channelGuid}"))
            await dataManager.SaveChannelFiles(channelGuid, null, null);
    }
}