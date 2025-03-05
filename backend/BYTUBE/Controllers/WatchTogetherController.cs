using BYTUBE.Exceptions;
using BYTUBE.Helpers;
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

        public WatchTogetherController(WatchTogetherLobbyService watchTogetherLobby)
        {
            _watchTogetherLobby = watchTogetherLobby;
        }

        [HttpGet("lobbys")]
        public IResult GetLobbys()
        {
            return Results.Json(_watchTogetherLobby.Lobbies);
        }

        [HttpPost("lobby"), Authorize]
        public IResult CreateLobby([FromQuery] string lobbyName)
        {
            try
            {
                var user = AuthorizeData.FromContext(HttpContext);

                if (string.IsNullOrEmpty(lobbyName))
                    throw new SystemException("У лобби не указано название!");

                var oldLobby = _watchTogetherLobby.Lobbies.FirstOrDefault(l => l.OwnerId == user.Id);

                if (oldLobby != null)
                    _watchTogetherLobby.Lobbies.Remove(oldLobby);

                _watchTogetherLobby.Lobbies.Add(new()
                {
                    Name = lobbyName,
                    OwnerId = user.Id
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
    }
}
