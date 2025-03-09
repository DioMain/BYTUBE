namespace BYTUBE.Models.W2GLobby;

public class W2GLobbyModel
{
    public string Name { get; set; }
    public Guid OwnerId { get; set; }
    public int UsersCount { get; set; }
    public bool IsPrivate { get; set; }
}
