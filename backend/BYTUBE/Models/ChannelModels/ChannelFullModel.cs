using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Models.ChannelModels
{
    public class ChannelFullModel : ChannelModel
    {
        public string Description { get; set; }

        public DateTime Created { get; set; }

        public string BannerUrl { get; set; }
    }
}
