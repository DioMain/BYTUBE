namespace BYTUBE.Services;

public class WatchTogetherLobbyService
{
    #region
    public class ChatMessage
    {
        public Guid UserId { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; }
    }
    #endregion

    #region Lobby
    public class Lobby
    {
        public required string Name { get; set; }
        public Guid? Master { get; set; }

        public Dictionary<Guid, string> ConnectedUsers { get; set; } = [];

        public Guid? VideoId;

        public string? Password { get; set; }

        public List<Guid> AllowedUser { get; set; } = [];

        public List<ChatMessage> Messages { get; set; } = [];
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