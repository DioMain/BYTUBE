namespace BYTUBE.Models
{
    public class SelectOptions
    {
        public string Ignore { get; set; } = string.Empty;
        public string SearchPattern { get; set; } = string.Empty;

        public int Take { get; set; } = 6;
        public int Skip { get; set; } = 0;

        public bool Favorite { get; set; } = false;
        public bool Subscribes { get; set; } = false;

        public bool AsAdmin { get; set; } = false;

        public SelectOrderBy OrderBy { get; set; } = SelectOrderBy.None;
    }

    public enum SelectOrderBy
    {
        None, Creation, CreationDesc, Reports, ReportsDesc, Views
    }
}
