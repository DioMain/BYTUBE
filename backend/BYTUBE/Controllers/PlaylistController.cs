using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly PostgresDbContext _db;

        private bool IsAutorize => HttpContext.User.Claims.Any();
        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);

        public PlaylistController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.Include(i => i.PlaylistItems).FirstOrDefaultAsync(i => i.Id == id);

                if (playlist == null)
                    throw new ServerException("Плейлист не найден", 404);

                if (playlist.Access == Playlist.AccessType.Private)
                {
                    if (!IsAutorize)
                        throw new ServerException("Плейлист не доступен", 401);
                    else if (UserId != playlist.UserId)
                        throw new ServerException("Плейлист вам не доступен", 403);
                }
                    

                return Results.Json(new PlaylistModel()
                {
                    Id = id,
                    Name = playlist.Name,
                    Access = playlist.Access,
                    UserId = playlist.UserId,
                    PlaylistItems = playlist.PlaylistItems.Select(item => new PlaylistModel.PlaylistItemModel()
                    {
                        PlaylistId = item.Id,
                        VideoId = item.VideoId,
                    }).ToList()
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("user"), Authorize]
        public async Task<IResult> GetByUser()
        {
            try
            {
                Playlist[] playlist = await _db.Playlists
                    .Include(i => i.PlaylistItems)
                    .Where(i => i.UserId == UserId)
                    .ToArrayAsync();

                return Results.Json(playlist.Select(playlist =>
                {
                    return new PlaylistModel()
                    {
                        Id = playlist.Id,
                        Name = playlist.Name,
                        Access = playlist.Access,
                        UserId = playlist.UserId,
                        PlaylistItems = playlist.PlaylistItems.Select(item => new PlaylistModel.PlaylistItemModel()
                        {
                            PlaylistId = item.Id,
                            VideoId = item.VideoId,
                        }).ToList()
                    };
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromBody] PlaylistModel model)
        {
            try
            {
                _db.Playlists.Add(new Playlist()
                {
                    Name = model.Name,
                    Access = model.Access,
                    UserId = UserId,
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("add"), Authorize]
        public async Task<IResult> AddVideoToPlaylist([FromQuery] int id, [FromQuery] int vid)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(x => x.Id == id);
                Video? video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == vid);

                if (playlist == null || video == null)
                    throw new ServerException("Видео или плейлист не найден", 404);

                if (playlist.UserId != UserId)
                    throw new ServerException("Плейлист вам не принадлежит", 403);

                _db.PlaylistItems.Add(new PlaylistItem()
                {
                    PlaylistId = playlist.Id,
                    VideoId = video.Id,
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete("remove"), Authorize]
        public async Task<IResult> RemoveVideoFromPlaylist([FromQuery] int id, [FromQuery] int vid)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(x => x.Id == id);
                Video? video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == vid);

                if (playlist == null || video == null)
                    throw new ServerException("Видео или плейлист не найден", 404);

                if (playlist.UserId != UserId)
                    throw new ServerException("Плейлист вам не принадлежит", 403);

                PlaylistItem? playlistItem = await _db.PlaylistItems
                    .FirstOrDefaultAsync(item => item.VideoId == video.Id && item.PlaylistId == playlist.Id);

                if (playlistItem == null)
                    throw new ServerException("Видео и так не в плейлисте", 404);

                _db.PlaylistItems.Remove(playlistItem);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromBody] PlaylistModel model, [FromQuery] int id)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(c => c.Id == id);

                if (playlist == null)
                    throw new ServerException("Плейлист не найден!", 404);

                if (playlist.UserId != UserId)
                    throw new ServerException("Плейлист вам не пренадлежит", 403);

                playlist.Name = model.Name;
                playlist.Access = model.Access;

                _db.Playlists.Update(playlist);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] int id)
        {
            try
            {
                Playlist? playlist = await _db.Playlists.Include(pl => pl.PlaylistItems).FirstOrDefaultAsync(c => c.Id == id);

                if (playlist == null)
                    throw new ServerException("Плейлист не найден!", 404);

                if (playlist.UserId != UserId)
                    throw new ServerException("Плейлист вам не пренадлежит", 403);

                _db.Playlists.Remove(playlist);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
