
namespace BYTUBE.Services
{
    public class WatchTogetherLobbyCleaningService : BackgroundService
    {
        private readonly WatchTogetherLobbyService _watchTogetherLobby;

        public WatchTogetherLobbyCleaningService(WatchTogetherLobbyService watchTogetherLobby)
        {
            _watchTogetherLobby = watchTogetherLobby;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                _watchTogetherLobby.Lobbies.RemoveAll(l => l.ConnectedUsers.Count == 0);

                await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
            }
        }
    }
}
