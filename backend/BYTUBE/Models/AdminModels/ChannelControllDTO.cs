using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.UserModels;

namespace BYTUBE.Models.AdminModels
{
    public class ChannelControllDTO
    {
        public UserPrivateModel User { get; set; }
        public ChannelFullModel Channel { get; set; }
    }
}
