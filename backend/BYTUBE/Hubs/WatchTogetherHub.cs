using BYTUBE.Helpers;
using BYTUBE.Services;
using Microsoft.AspNetCore.SignalR;

namespace BYTUBE.Hubs
{
    public class WatchTogetherHub : Hub
    {
        private readonly WatchTogetherLobbyService _watchTogetherLobby;

        public WatchTogetherHub(WatchTogetherLobbyService watchTogetherLobby)
        {
            _watchTogetherLobby = watchTogetherLobby;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var lobby = _watchTogetherLobby.Lobbies
                            .FirstOrDefault(l => l.Users
                                .Any(u => u.Value == Context.ConnectionId));

            if (lobby == null)
                return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby.Name);

            var user = AuthorizeData.FromClaims(Context.User);

            lobby.Users.Remove(user.Id);
        }

        public async Task Play()
        {

        }

        public async Task Pause()
        {

        }

        public async Task Seek(float time)
        {
            
        }

        public async Task Sync(float time)
        {

        }

        public async Task SendMessage(string message)
        {
            
        }

        public async Task JoinToLobby(string lobbyName)
        {
            var lobby = _watchTogetherLobby.Lobbies
                .FirstOrDefault(l => l.Name == lobbyName);

            if (lobby == null)
                return;

            var user = AuthorizeData.FromClaims(Context.User);

            lobby.Users.Add(user.Id, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        }
    }
}
