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
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby.Name);

            var user = AuthorizeData.FromClaims(Context.User);

            lobby.ConnectedUsers.Remove(user.Id);
        }

        public async Task Play()
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            var user = AuthorizeData.FromClaims(Context.User);

            await Clients.OthersInGroup(lobby.Name).SendAsync("onPlay");
        }

        public async Task Pause()
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onPause");
        }

        public async Task Seek(float time)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onSeek", time);
        }

        public async Task Sync(float time, bool isPlay)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onSync", time, isPlay);
        }

        public async Task RequestSync()
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null || lobby.ConnectedUsers.Count == 0)
                return;

            await Clients.Client(lobby.ConnectedUsers.First().Value).SendAsync("onRequestSync");
        }

        public async Task SendMessage(string message)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onMessage", message);
        }

        public async Task JoinToLobby(string lobbyName)
        {
            var lobby = _watchTogetherLobby.Lobbies
                .FirstOrDefault(l => l.Name == lobbyName);

            if (lobby == null)
                return;

            var user = AuthorizeData.FromClaims(Context.User);

            if (lobby.ConnectedUsers.ContainsKey(user.Id))
                lobby.ConnectedUsers[user.Id] = Context.ConnectionId;
            else
                lobby.ConnectedUsers.Add(user.Id, Context.ConnectionId);

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        }
    }
}
