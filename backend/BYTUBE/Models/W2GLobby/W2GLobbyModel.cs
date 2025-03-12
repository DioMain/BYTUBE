namespace BYTUBE.Models.W2GLobby;

public class W2GLobbyModel
{
    public string Name { get; set; }
    public Guid? Master { get; set; }
    public int UsersCount { get; set; }
    public List<Guid>? Users { get; set; }
    public Guid? VideoId { get; set; }
    public bool IsPrivate { get; set; }
}
