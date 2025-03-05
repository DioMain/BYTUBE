namespace BYTUBE.Services;

public class WatchTogetherLobbyService
{
    #region Lobby model
    public class Lobby
    {
        public required string Name { get; set; }
        public required Guid OwnerId { get; set; }

        public Dictionary<Guid, string> Users { get; set; } = [];
    }
    #endregion

    public List<Lobby> Lobbies { get; private set; }


    public WatchTogetherLobbyService()
    {
        Lobbies = [];
    }
}