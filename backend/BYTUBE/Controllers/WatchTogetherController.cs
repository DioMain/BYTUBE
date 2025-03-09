using BYTUBE.Exceptions;
using BYTUBE.Helpers;
using BYTUBE.Models;
using BYTUBE.Models.W2GLobby;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchTogetherController : ControllerBase
    {
        private readonly WatchTogetherLobbyService _watchTogetherLobby;
        private readonly PasswordHasherService _passwordHasher;

        public WatchTogetherController(WatchTogetherLobbyService watchTogetherLobby, PasswordHasherService passwordHasher)
        {
            _watchTogetherLobby = watchTogetherLobby;
            _passwordHasher = passwordHasher;
        }

        [HttpGet("lobbys")]
        public IResult GetLobbys()
        {
            return Results.Json(_watchTogetherLobby.Lobbies.Select(l =>
            {
                return new W2GLobbyModel()
                {
                    Name = l.Name,
                    OwnerId = l.OwnerId,
                    UsersCount = l.ConnectedUsers.Count,
                    IsPrivate = l.Password != null
                };
            }));
        }

        [HttpPost("lobby"), Authorize]
        public IResult CreateLobby([FromBody] W2GLobbyCreateModel model)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                var oldLobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.OwnerId == user.Id);

                if (oldLobby != null)
                    _watchTogetherLobby.Lobbies.Remove(oldLobby);


                _watchTogetherLobby.Lobbies.Add(new()
                {
                    Name = model.Name,
                    OwnerId = user.Id,
                    Password = model.Password != null ? _passwordHasher.Hash(model.Password) : null,
                    AllowedUser = [user.Id]
                });

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete("lobby"), Authorize]
        public IResult DeleteLobby([FromQuery] string lobbyName)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                if (string.IsNullOrEmpty(lobbyName))
                    throw new SystemException("У лобби не указано название!");

                var oldLobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.OwnerId == user.Id)
                    ?? throw new ServerException("Лобби не найдено!", 404);

                _watchTogetherLobby.Lobbies.Remove(oldLobby);

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("try"), Authorize]
        public IResult TryEnter([FromQuery] string lobbyName)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                var lobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.Name == lobbyName)
                    ?? throw new ServerException("Лобби не найдено!", 404); 

                if (!lobby.AllowedUser.Contains(user.Id))
                {
                    if (lobby.Password == null)
                        lobby.AllowedUser.Add(user.Id);
                    else
                        throw new ServerException("У пользователя не разрешения!", 403);
                }

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("pass"), Authorize]
        public IResult PassInLobby([FromBody] W2GLobbyCreateModel model)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                var lobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.Name == model.Name)
                    ?? throw new ServerException("Лобби не найдено!", 404);

                if (lobby.AllowedUser.Contains(user.Id))
                    throw new ServerException("Это лобби уже вам доступно!");

                if (lobby.Password == null)
                    throw new ServerException("Для этого лобби праверка пароля не требуеться!");

                if (model.Password == null)
                    throw new ServerException("Пароль не указан!");

                if (!_passwordHasher.Verify(model.Password, lobby.Password))
                    throw new ServerException("Пароли не совпадают!", 403);

                lobby.AllowedUser.Add(user.Id);

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
