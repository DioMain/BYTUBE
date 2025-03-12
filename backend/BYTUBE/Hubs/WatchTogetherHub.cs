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
            await LeaveTheLobby();
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

        public async Task Sync(float time)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onSync", time);
        }

        public async Task RequestSync()
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null || lobby.ConnectedUsers.Count == 0)
                return;

            if (lobby.Master == null)
                return;

            var masterConId = lobby.ConnectedUsers[(Guid)lobby.Master];

            await Clients.Client(masterConId).SendAsync("onRequestSync");
        }

        public async Task VideoChange(Guid videoId)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            var user = AuthorizeData.FromClaims(Context.User);

            if (lobby.Master != user.Id)
                return;

            lobby.VideoId = videoId;

            await Clients.Group(lobby.Name).SendAsync("onLobbyChanged");
        }

        public async Task SendMessage(string message)
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            var user = AuthorizeData.FromClaims(Context.User);

            await Clients.OthersInGroup(lobby.Name).SendAsync("onMessage", message, user.Id);
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

            if (lobby.Master == null)
                lobby.Master = user.Id;

            await Clients.OthersInGroup(lobby.Name).SendAsync("onPause");

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);

            await Clients.Group(lobby.Name).SendAsync("onLobbyChanged");
        }

        public async Task LeaveTheLobby()
        {
            var lobby = _watchTogetherLobby.GetLobbyByConnetionId(Context.ConnectionId);

            if (lobby == null)
                return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobby.Name);

            var user = AuthorizeData.FromClaims(Context.User);

            lobby.ConnectedUsers.Remove(user.Id);

            if (lobby.Master == user.Id)
            {
                if (lobby.ConnectedUsers.Count > 0)
                    lobby.Master = lobby.ConnectedUsers.First().Key;
                else
                    lobby.Master = null;
            }

            await Clients.Group(lobby.Name).SendAsync("onLobbyChanged");
        }
    }
}
