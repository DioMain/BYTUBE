using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
using BYTUBE.Models;
using BYTUBE.Models.UserModels;
using BYTUBE.Models.W2GLobby;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchTogetherController : ControllerBase
    {
        private readonly WatchTogetherLobbyService _watchTogetherLobby;
        private readonly PasswordHasherService _passwordHasher;
        private readonly PostgresDbContext _postgresDb;
        private readonly LocalDataService _localData;

        public WatchTogetherController(
            WatchTogetherLobbyService watchTogetherLobby, 
            PasswordHasherService passwordHasher, 
            PostgresDbContext postgresDb,
            LocalDataService localData)
        {
            _watchTogetherLobby = watchTogetherLobby;
            _passwordHasher = passwordHasher;
            _postgresDb = postgresDb;
            _localData = localData;
        }

        [HttpGet("lobbys")]
        public IResult GetLobbys()
        {
            return Results.Json(_watchTogetherLobby.Lobbies.Select(l =>
            {
                return new W2GLobbyModel()
                {
                    Name = l.Name,
                    Master = l.Master,
                    UsersCount = l.ConnectedUsers.Count,
                    IsPrivate = l.Password != null,
                    VideoId = l.VideoId
                };
            }));
        }

        [HttpGet("lobby"), Authorize]
        public async Task<IResult> GetLobby([FromQuery] string lobbyName)
        {
            try
            {
                var lobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => lobbyName == l.Name)
                    ?? throw new ServerException("Lobby not found", 404);

                var user = AuthorizeData.FromContext(HttpContext);

                if (!lobby.AllowedUser.Contains(user.Id))
                    throw new ServerException("Lobby not allowed", 403);

                List<User> users = [];

                foreach (var usedId in lobby.ConnectedUsers.Keys)
                {
                    var usr = await _postgresDb.Users.FindAsync(usedId);

                    if (usr == null)
                        continue;

                    users.Add(usr);
                }

                return Results.Json(new W2GLobbyModel()
                {
                    Name = lobby.Name,
                    Master = lobby.Master,
                    Users = users.Select(u =>
                    {
                        var userLocalData = _localData.GetUserData(u.Id);
                        string imgUrl = $"/data/users/{u.Id}/icon.{userLocalData.IconExtention}";

                        return new UserPrivateModel()
                        {
                            Id = u.Id.ToString(),
                            Name = u.Name,
                            Email = u.Email,
                            IconUrl = imgUrl,
                            Role = u.Role
                        };
                    }).ToList(),
                    UsersCount = lobby.ConnectedUsers.Count,
                    IsPrivate = lobby.Password != null,
                    VideoId = lobby.VideoId
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("lobby"), Authorize]
        public IResult CreateLobby([FromBody] W2GLobbyCreateModel model)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                if (_watchTogetherLobby.Lobbies.Any(l => l.Name == model.Name))
                    throw new ServerException("Lobby with this name has exists!");

                _watchTogetherLobby.Lobbies.Add(new()
                {
                    Name = model.Name,
                    Master = user.Id,
                    Password = model.Password != null ? _passwordHasher.Hash(model.Password) : null,
                    VideoId = model.Video, 
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

                var oldLobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.Master == user.Id)
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
