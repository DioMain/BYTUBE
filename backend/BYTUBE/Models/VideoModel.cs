using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Models
{
    public class VideoModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public int Views { get; set; }

        public List<string> Tags { get; set; }

        public DateTime Created { get; set; }

        public string Duration { get; set; }

        public ChannelModel Channel { get; set; }
    }
}
