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
        private readonly LocalDataService _localData;
        private readonly CommentRepository _commentRepository;

        public CommentController(LocalDataService localData, CommentRepository repository)
        {
            _localData = localData;
            _commentRepository = repository;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Comment comment = await _commentRepository.GetCommentWithAuthor(id)
                    ?? throw new ServerException("Комментарий не найден", 404); 

                var usrData = _localData.GetUserData(comment.User.Id);

                bool userIsLikeIt = false;

                if (authData.IsAutorize)
                    userIsLikeIt = comment.Likes.Contains(authData.Id);

                return Results.Json(new CommentModel()
                {
                    Id = id.ToString(),
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
                        Id = comment.UserId.ToString(),
                    }
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("video")]
        public async Task<IResult> GetVideoComments([FromQuery] Guid vid)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Comment[] comments = await _commentRepository.GetVideoComments(vid);

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

                await _commentRepository.CreateAsync(new Comment()
                {
                    Message = model.Message,
                    VideoId = vguid,
                    UserId = authData.Id,
                    Likes = [],
                    Created = DateTime.Now.ToUniversalTime(),
                });

                await _commentRepository.SaveChanges();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("like"), Authorize]
        public async Task<IResult> LikeComment([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                var comment = await _commentRepository.GetAsync(id)
                        ?? throw new ServerException("Комментарий не найден!", 404);

                if (!comment.Likes.Contains(authData.Id))
                    comment.Likes.Add(authData.Id);
                else
                    comment.Likes.Remove(authData.Id);

                _commentRepository.Update(comment);

                await _commentRepository.SaveChanges();

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

                Comment comment = await _commentRepository.GetWithVideoAndChannel(id)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != authData.Id)
                    throw new ServerException("Комментарий вам не пренадлежит", 403);

                comment.Message = model.Message;

                _commentRepository.Update(comment);

                await _commentRepository.SaveChanges();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Comment comment = await _commentRepository.GetWithVideoAndChannel(id)
                    ?? throw new ServerException("Комментарий не найден!", 404);

                if (comment.UserId != authData.Id 
                 && authData.Role != Entity.Models.User.RoleType.Admin 
                 && comment.Video.Channel.UserId != authData.Id)
                    throw new ServerException("Комментарий вам не пренадлежит", 403);

                _commentRepository.Delete(comment.Id);

                await _commentRepository.SaveChanges();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
