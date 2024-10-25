namespace BYTUBE.Models
{
    public class ServerErrorModel
    {
        public string type { get; set; } 
        public string title { get; set; } 
        public int status { get; set; } 
        public Dictionary<string, string[]> errors { get; set; }

        public ServerErrorModel(int status, string title = "Some errors!")
        {
            type = "https://tools.ietf.org/html/rfc9110#section-15.5.1";
            this.title = title;
            this.status = status;
            errors = new Dictionary<string, string[]>();
        }
    }
}
