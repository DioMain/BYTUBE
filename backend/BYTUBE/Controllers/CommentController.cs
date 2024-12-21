using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using BYTUBE.Models.UserModels;
using BYTUBE.Services;
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
        private readonly LocalDataManager _localData;

        private bool IsAutorize => HttpContext.User.Claims.Any();
        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private User.RoleType Role => Enum.Parse<User.RoleType>(HttpContext.User.Claims.ToArray()[1].Value);

        public CommentController(PostgresDbContext db, LocalDataManager localData)
        {
            _db = db;
            _localData = localData;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                Comment? comment = await _db.Comments.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == id);


                if (comment == null || comment.User == null)
                    throw new ServerException("Комментарий не найден", 404);

                var usrData = _localData.GetUserData(comment.User.Id);

                bool userIsLikeIt = false;

                if (IsAutorize)
                    userIsLikeIt = comment.Likes.Contains(UserId);

                return Results.Json(new CommentModel()
                {
                    Id = id,
                    Message = comment.Message,
                    UserId = comment.UserId,
                    VideoId = comment.VideoId,
                    LikesCount = comment.Likes.Count,
                    UserIsLikeIt = userIsLikeIt,
                    Created = comment.Created,
                    IsVideoOwner = false,
                    User = new UserPublicModel()
                    {
                        IconUrl = $"/data/users/{comment.User.Id}/icon.{usrData.IconExtention}",
                        Name = comment.User.Name,
                        Id = id,
                    }
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
                Comment[] comments = await _db.Comments
                    .Include(i => i.User)
                    .Include(i => i.Video)
                    .Include(i => i.Video!.Owner)
                    .Where(i => i.VideoId == vid)
                    .OrderBy(i => i.Created)
                    .ToArrayAsync();

                return Results.Json(comments.Select(comment =>
                {
                    var usrData = _localData.GetUserData(comment.User.Id);

                    bool userIsLikeIt = false;
                    bool isVideoOwner = false;

                    if (IsAutorize)
                    {
                        userIsLikeIt = comment.Likes.Contains(UserId);
                        isVideoOwner = comment.Video!.Owner!.UserId == UserId;
                    } 

                    return new CommentModel()
                    {
                        Id = comment.Id,
                        Message = comment.Message,
                        VideoId = comment.VideoId,
                        UserId = comment.UserId,
                        LikesCount = comment.Likes.Count,
                        UserIsLikeIt = userIsLikeIt,
                        IsVideoOwner = isVideoOwner,
                        Created = comment.Created,
                        User = new UserPublicModel()
                        {
                            IconUrl = $"/data/users/{comment.User.Id}/icon.{usrData.IconExtention}",
                            Name = comment.User.Name,
                            Id = comment.UserId,
                        }
                    };
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
                    Likes = [],
                    Created = DateTime.Now.ToUniversalTime(),
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("like"), Authorize]
        public async Task<IResult> LikeComment([FromQuery] int id)
        {
            try
            {
                var comment = await _db.Comments.Where(x => x.Id == id).FirstOrDefaultAsync();

                if (comment == null)
                    throw new ServerException("Комментарий не найден!", 404);

                if (!comment.Likes.Contains(UserId))
                    comment.Likes.Add(UserId);
                else
                    comment.Likes.Remove(UserId);

                _db.Comments.Update(comment);

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
                Comment? comment = await _db.Comments
                    .Include(i => i.Video)
                    .Include(i => i.Video!.Owner)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (comment == null)
                    throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId && 
                    Role != Entity.Models.User.RoleType.Admin && 
                    comment.Video!.Owner!.UserId != UserId)
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
                Comment? comment = await _db.Comments
                                        .Include(i => i.Video)
                                        .Include(i => i.Video!.Owner)
                                        .FirstOrDefaultAsync(c => c.Id == id);

                if (comment == null)
                    throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId 
                    && Role != Entity.Models.User.RoleType.Admin &&
                    comment.Video!.Owner!.UserId != UserId)
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
