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
        private readonly LocalDataService _localData;

        private bool IsAutorize => HttpContext.User.Claims.Any();
        private Guid UserId => Guid.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private User.RoleType Role => Enum.Parse<User.RoleType>(HttpContext.User.Claims.ToArray()[1].Value);

        public CommentController(PostgresDbContext db, LocalDataService localData)
        {
            _db = db;
            _localData = localData;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Comment? comment = await _db.Comments.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == guid);

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
                    UserId = comment.UserId.ToString(),
                    VideoId = comment.VideoId.ToString(),
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
        public async Task<IResult> GetVideoComments([FromQuery] string vid)
        {
            try
            {
                if (!Guid.TryParse(vid, out Guid vguid))
                    throw new ServerException("vId is not correct!");

                Comment[] comments = await _db.Comments
                    .Include(i => i.User)
                    .Include(i => i.Video)
                    .Include(i => i.Video!.Owner)
                    .Where(i => i.VideoId == vguid)
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
                        Id = comment.Id.ToString(),
                        Message = comment.Message,
                        VideoId = comment.VideoId.ToString(),
                        UserId = comment.UserId.ToString(),
                        LikesCount = comment.Likes.Count,
                        UserIsLikeIt = userIsLikeIt,
                        IsVideoOwner = isVideoOwner,
                        Created = comment.Created,
                        User = new UserPublicModel()
                        {
                            IconUrl = $"/data/users/{comment.User.Id}/icon.{usrData.IconExtention}",
                            Name = comment.User.Name,
                            Id = comment.UserId.ToString(),
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
                if (!Guid.TryParse(model.VideoId, out Guid vguid))
                    throw new ServerException("Video id is not correct!");

                _db.Comments.Add(new Comment()
                {
                    Message = model.Message,
                    VideoId = vguid,
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
        public async Task<IResult> LikeComment([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                var comment = await _db.Comments.FindAsync(guid)
                        ?? throw new ServerException("Комментарий не найден!", 404);

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
        public async Task<IResult> Put([FromBody] CommentModel model, [FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Comment? comment = await _db.Comments
                    .Include(i => i.Video)
                        .ThenInclude(i => i.Owner)
                    .FirstOrDefaultAsync(c => c.Id == guid)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId && 
                    Role != Entity.Models.User.RoleType.Admin && 
                    comment.Video.Owner.UserId != UserId)
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
        public async Task<IResult> Delete([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Comment? comment = await _db.Comments
                                        .Include(i => i.Video)
                                        .Include(i => i.Video!.Owner)
                                        .FirstOrDefaultAsync(c => c.Id == guid)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != UserId 
                 && Role != Entity.Models.User.RoleType.Admin 
                 && comment.Video.Owner.UserId != UserId)
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
