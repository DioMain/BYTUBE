using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Models.ChannelModels
{
    public class ChannelFullModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }

        public int Subscribes { get; set; }

        public string IconUrl { get; set; }
        public string BannerUrl { get; set; }
    }
}
