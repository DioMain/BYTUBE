namespace BYTUBE.Services;

public class WatchTogetherLobbyService
{
    #region Lobby
    public class Lobby
    {
        public required string Name { get; set; }
        public required Guid OwnerId { get; set; }

        public Dictionary<Guid, string> ConnectedUsers { get; set; } = [];

        public string? Password { get; set; }

        public List<Guid> AllowedUser { get; set; } = [];
    }
    #endregion

    public List<Lobby> Lobbies { get; private set; }

    public WatchTogetherLobbyService()
    {
        Lobbies = [];
    }

    public Lobby? GetLobbyByConnetionId(string id)
    {
        var lobby = Lobbies.FirstOrDefault(l => l.ConnectedUsers.Any(u => u.Value == id));

        return lobby;
    }

    public Lobby? GetLobbyByUserId(Guid id)
    {
        var lobby = Lobbies.FirstOrDefault(l => l.ConnectedUsers.Any(u => u.Key == id));

        return lobby;
    }
}