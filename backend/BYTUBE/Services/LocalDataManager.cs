using System.IO;
using System.Text.Json;

namespace BYTUBE.Services
{
    public class LocalDataManager
    {
        public class UserData
        {
            public string IconExtention { get; set; } = "png";
        }

        public class ChannelData
        {
            public string IconExtention { get; set; } = "png";
            public string BannerExtention { get; set; } = "png";
        }

        public class VideoData
        {
            public string PreviewExtention { get; set; } = "png";
            public string VideoExtention { get; set; } = "mp4";
        }

        public const string VideosPath = "./wwwroot/videos/";
        public const string ChannelsPath = "./wwwroot/channels/";
        public const string UsersPath = "./wwwroot/users/";

        public LocalDataManager()
        {

        }

        public VideoData GetVideoData(int id)
        {
            return JsonSerializer.Deserialize<VideoData>(File.ReadAllText(Path.Combine(VideosPath, $"{id}/info.json")))!;
        }

        public void SetVideoData(int id, VideoData data)
        {
            File.WriteAllText(Path.Combine(VideosPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }

        public ChannelData GetChannelData(int id)
        {
            return JsonSerializer.Deserialize<ChannelData>(File.ReadAllText(Path.Combine(ChannelsPath, $"{id}/info.json")))!;
        }

        public void SetChannelData(int id, ChannelData data)
        {
            File.WriteAllText(Path.Combine(ChannelsPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }

        public UserData GetUserData(int id)
        {
            return JsonSerializer.Deserialize<UserData>(File.ReadAllText(Path.Combine(UsersPath, $"{id}/info.json")))!;
        }

        public void SetUserData(int id, UserData data)
        {
            File.WriteAllText(Path.Combine(UsersPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }
    }
}
