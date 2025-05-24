using BYTUBE.Entity.Models;
using BYTUBE.Entity.Repositories;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
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
        private readonly CommentRepository _commentRepository;

        public CommentController(PostgresDbContext db, LocalDataService localData, CommentRepository repository)
        {
            _db = db;
            _localData = localData;
            _commentRepository = repository;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("Id is not correct!");

                Comment comment = await _commentRepository.GetCommentWithAuthor(guid)
                    ?? throw new ServerException("Комментарий не найден", 404); 

                var usrData = _localData.GetUserData(comment.User.Id);

                bool userIsLikeIt = false;

                if (authData.IsAutorize)
                    userIsLikeIt = comment.Likes.Contains(authData.Id);

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
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(vid, out Guid vguid))
                    throw new ServerException("vId is not correct!");

                Comment[] comments = await _commentRepository.GetVideoComments(vguid);

                return Results.Json(comments.Select(comment =>
                {
                    var usrData = _localData.GetUserData(comment.User.Id);

                    bool userIsLikeIt = false;
                    bool isVideoOwner = false;

                    if (authData.IsAutorize)
                    {
                        userIsLikeIt = comment.Likes.Contains(authData.Id);
                        isVideoOwner = comment.Video!.Channel!.UserId == authData.Id;
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
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(model.VideoId, out Guid vguid))
                    throw new ServerException("Video id is not correct!");

                _db.Comments.Add(new Comment()
                {
                    Message = model.Message,
                    VideoId = vguid,
                    UserId = authData.Id,
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
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                var comment = await _db.Comments.FindAsync(guid)
                        ?? throw new ServerException("Комментарий не найден!", 404);

                if (!comment.Likes.Contains(authData.Id))
                    comment.Likes.Add(authData.Id);
                else
                    comment.Likes.Remove(authData.Id);

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
        public async Task<IResult> Put([FromBody] CommentModel model, [FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Comment? comment = await _db.Comments
                    .Include(i => i.Video)
                        .ThenInclude(i => i.Channel)
                    .FirstOrDefaultAsync(c => c.Id == id)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != authData.Id)
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
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                Comment? comment = await _db.Comments
                                        .Include(i => i.Video)
                                        .Include(i => i.Video!.Channel)
                                        .FirstOrDefaultAsync(c => c.Id == guid)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != authData.Id 
                 && authData.Role != Entity.Models.User.RoleType.Admin 
                 && comment.Video.Channel.UserId != authData.Id)
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
