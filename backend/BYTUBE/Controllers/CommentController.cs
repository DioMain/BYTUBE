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
    public class CommentController : ControllerBase
    {
        private readonly PostgresDbContext _db;

        private bool IsAutorize => HttpContext.User.Claims.Any();
        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);

        public CommentController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id, [FromQuery] bool withChildren = false)
        {
            try
            {
                Comment? comment = null;

                if (withChildren)
                {
                    comment = await _db.Comments.FirstOrDefaultAsync(i => i.Id == id);
                }
                else
                {
                    comment = await _db.Comments.FirstOrDefaultAsync(i => i.Id == id);
                }

                if (comment == null)
                    throw new ServerException("Комментарий не найден", 404);

                return Results.Json(new CommentModel()
                {
                    Id = id,
                    Message = comment.Message,
                    UserId = comment.UserId,
                    VideoId = comment.VideoId,
                    Likes = comment.Likes,
                    Created = comment.Created,
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("video")]
        public async Task<IResult> GetVideoComments([FromQuery] int vid)
        {
            try
            {
                Video? video = await _db.Videos.Include(v => v.Comments).FirstOrDefaultAsync(i => i.Id == vid);

                if (video == null)
                    throw new ServerException("Видео не найдено", 404);

                return Results.Json(video.Comments.Select(comment => new CommentModel()
                {
                    Id = comment.Id,
                    Message = comment.Message,
                    VideoId = comment.VideoId,
                    UserId = comment.UserId,
                    Likes = comment.Likes,
                    Created = comment.Created,
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromBody] CommentModel model)
        {
            try
            {
                _db.Comments.Add(new Comment()
                {
                    Message = model.Message,
                    VideoId = model.VideoId,
                    UserId = UserId,
                    Likes = []
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromBody] CommentModel model, [FromQuery] int id)
        {
            try
            {
                Comment? comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);

                if (comment == null)
                    throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId)
                    throw new ServerException("Комментарий вам не пренадлежит", 403);

                comment.Message = model.Message;

                _db.Comments.Update(comment);

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
                Comment? comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);

                if (comment == null)
                    throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId)
                    throw new ServerException("Комментарий вам не пренадлежит", 403);

                _db.Comments.Remove(comment);

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
