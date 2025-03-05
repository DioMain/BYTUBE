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

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
             return base.OnDisconnectedAsync(exception);
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

        public async Task JoinToGroup(Guid userId, string groupName)
        {
            
        }

        public async Task LeaveTheGroup(string groupName)
        {

        }
    }
}
