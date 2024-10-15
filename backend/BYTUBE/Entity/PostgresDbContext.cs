using BYTUBE.Entity.Models;
using Microsoft.EntityFrameworkCore;

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
        
    }
}