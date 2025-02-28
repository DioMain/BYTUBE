using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
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

        public PlaylistController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Playlist? playlist = await _db.Playlists
                    .Include(i => i.PlaylistItems)
                    .FirstOrDefaultAsync(i => i.Id == guid)
                    ?? throw new ServerException("Плейлист не найден!", 404);


                if (playlist.Access == Playlist.AccessType.Private)
                {
                    if (!authData.IsAutorize)
                        throw new ServerException("Плейлист не доступен!", 401);
                    else if (authData.Id != playlist.UserId)
                        throw new ServerException("Плейлист вам не принодлежит!", 403);
                }
                    

                return Results.Json(new PlaylistModel()
                {
                    Id = id,
                    Name = playlist.Name,
                    Access = playlist.Access,
                    UserId = playlist.UserId.ToString(),
                    PlaylistItems = playlist.PlaylistItems.OrderBy(i => i.Order).Select(item => new PlaylistModel.PlaylistItemModel()
                    {
                        PlaylistId = item.Id.ToString(),
                        VideoId = item.VideoId.ToString(),
                        Order = item.Order
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
                var authData = AuthorizeData.FromContext(HttpContext);

                Playlist[] playlist = await _db.Playlists
                    .Include(i => i.PlaylistItems)
                    .Where(i => i.UserId == authData.Id)
                    .ToArrayAsync();

                return Results.Json(playlist.Select(playlist =>
                {
                    return new PlaylistModel()
                    {
                        Id = playlist.Id.ToString(),
                        Name = playlist.Name,
                        Access = playlist.Access,
                        UserId = playlist.UserId.ToString(),
                        PlaylistItems = playlist.PlaylistItems.OrderBy(i => i.Order).Select(item => new PlaylistModel.PlaylistItemModel()
                        {
                            PlaylistId = item.Id.ToString(),
                            VideoId = item.VideoId.ToString(),
                            Order = item.Order
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
                var authData = AuthorizeData.FromContext(HttpContext);

                _db.Playlists.Add(new Playlist()
                {
                    Name = model.Name,
                    Access = model.Access,
                    UserId = authData.Id,
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
        public async Task<IResult> AddVideoToPlaylist([FromQuery] string id, [FromQuery] string vid)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                if (!Guid.TryParse(vid, out Guid vguid))
                    throw new ServerException("vid is not correct!");

                Playlist? playlist = await _db.Playlists.FindAsync(guid);
                Video? video = await _db.Videos.FindAsync(vguid);

                if (playlist == null || video == null)
                    throw new ServerException("Видео или плейлист не найден", 404);

                if (playlist.UserId != authData.Id)
                    throw new ServerException("Плейлист вам не принадлежит", 403);

                var playlistItems = await _db.PlaylistItems
                    .Where(PlaylistItem => PlaylistItem.PlaylistId == guid)
                    .ToArrayAsync();

                int order = 0;

                if (playlistItems.Length > 0)
                    order = playlistItems.Select(PlaylistItem => PlaylistItem.Order).Max() + 1;

                _db.PlaylistItems.Add(new PlaylistItem()
                {
                    PlaylistId = playlist.Id,
                    VideoId = video.Id,
                    Order = order,
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
        public async Task<IResult> RemoveVideoFromPlaylist([FromQuery] string id, [FromQuery] string vid)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                if (!Guid.TryParse(vid, out Guid vguid))
                    throw new ServerException("vid is not correct!");

                Playlist? playlist = await _db.Playlists.FindAsync(guid);
                Video? video = await _db.Videos.FindAsync(vguid);

                if (playlist == null || video == null)
                    throw new ServerException("Видео или плейлист не найден", 404);

                if (playlist.UserId != authData.Id)
                    throw new ServerException("Плейлист вам не принадлежит", 403);

                PlaylistItem? playlistItem = await _db.PlaylistItems
                    .FirstOrDefaultAsync(item => item.VideoId == video.Id && item.PlaylistId == playlist.Id)
                    ?? throw new ServerException("Видео и так не в плейлисте", 404);

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
        public async Task<IResult> Put([FromBody] PlaylistModel model, [FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Playlist playlist = await _db.Playlists.FindAsync(guid)
                    ?? throw new ServerException("Плейлист не найден!", 404);

                if (playlist.UserId != authData.Id)
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
        public async Task<IResult> Delete([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Playlist playlist = await _db.Playlists.FindAsync(guid)
                    ?? throw new ServerException("Плейлист не найден!", 404);

                if (playlist.UserId != authData.Id)
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
