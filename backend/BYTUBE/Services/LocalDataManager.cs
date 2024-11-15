using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using System.IO;
using System.Text.Json;
using Xabe.FFmpeg;

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

        public const string VideosPath = "./Data/videos";
        public const string ChannelsPath = "./Data/channels";
        public const string UsersPath = "./Data/users";

        public LocalDataManager()
        {
            if (!Directory.Exists("./Data"))
                Directory.CreateDirectory("./Data");

            if (!Directory.Exists(VideosPath)) 
                Directory.CreateDirectory(VideosPath);

            if (!Directory.Exists(ChannelsPath))
                Directory.CreateDirectory(ChannelsPath);

            if (!Directory.Exists(UsersPath))
                Directory.CreateDirectory(UsersPath);
        }

        public VideoData GetVideoData(int id)
        {
            return JsonSerializer.Deserialize<VideoData>(File.ReadAllText(Path.Combine(VideosPath, $"{id}/info.json")))!;
        }
        public void SetVideoData(int id, VideoData data)
        {
            File.WriteAllText(Path.Combine(VideosPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }

        /// <exception cref="ServerException"></exception>
        public async Task SaveVideoFiles(int id, IFormFile previewFile, IFormFile videoFile)
        {
            try
            {
                if (!Directory.Exists($"{VideosPath}/{id}"))
                    Directory.CreateDirectory($"{VideosPath}/{id}");

                string previewEx = previewFile.FileName.Split('.').Last();
                string videoEx = videoFile.FileName.Split('.').Last();

                string previewPath = $"{VideosPath}/{id}/preview.{previewEx}";
                string videoPath = $"{VideosPath}/{id}/video.{videoEx}";

                using (var stream = new FileStream(previewPath, FileMode.Create))
                {
                    await previewFile.CopyToAsync(stream)!;
                }

                using (var stream = new FileStream(videoPath, FileMode.Create))
                {
                    await videoFile.CopyToAsync(stream)!;
                }

                SetVideoData(id, new VideoData()
                {
                    PreviewExtention = previewEx,
                    VideoExtention = videoEx,
                });
            }
            catch
            {
                throw new ServerException("Ошибка при сохранение файлов видео", 500);
            }
        }

        /// <exception cref="ServerException"></exception>
        public async Task SaveVideoFiles(int id, IFormFile previewFile)
        {
            try
            {
                if (!Directory.Exists($"{VideosPath}/{id}"))
                    Directory.CreateDirectory($"{VideosPath}/{id}");

                string previewEx = previewFile.FileName.Split('.').Last();
                string previewPath = $"{VideosPath}/{id}/preview.{previewEx}";

                using (var stream = new FileStream(previewPath, FileMode.Create))
                {
                    await previewFile.CopyToAsync(stream)!;
                }

                var vData = GetVideoData(id);

                SetVideoData(id, new VideoData()
                {
                    PreviewExtention = previewEx,
                    VideoExtention = vData.VideoExtention,
                });
            }
            catch
            {
                throw new ServerException("Ошибка при сохранение файлов видео", 500);
            }
        }

        public ChannelData GetChannelData(int id)
        {
            return JsonSerializer.Deserialize<ChannelData>(File.ReadAllText(Path.Combine(ChannelsPath, $"{id}/info.json")))!;
        }
        public void SetChannelData(int id, ChannelData data)
        {
            File.WriteAllText(Path.Combine(ChannelsPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }

        /// <exception cref="ServerException"></exception>
        public async Task SaveChannelFiles(int id, IFormFile? iconFile, IFormFile? bannerFile, bool alreadyExists = false)
        {
            try
            {
                if (!Directory.Exists($"{ChannelsPath}/{id}"))
                    Directory.CreateDirectory($"{ChannelsPath}/{id}");

                var info = new ChannelData();

                if (alreadyExists)
                {
                    info = GetChannelData(id);
                }

                if (iconFile != null)
                {
                    string iconEx = iconFile.FileName.Split('.').Last();
                    string iconPath = $"{ChannelsPath}/{id}/icon.{iconEx}";

                    using (var stream = new FileStream(iconPath, FileMode.Create))
                    {
                        await iconFile.CopyToAsync(stream)!;
                    }

                    info.IconExtention = iconEx;
                }

                if (bannerFile != null)
                {
                    string bannerEx = bannerFile.FileName.Split('.').Last();
                    string bannerPath = $"{ChannelsPath}/{id}/banner.{bannerEx}";

                    using (var stream = new FileStream(bannerPath, FileMode.Create))
                    {
                        await bannerFile.CopyToAsync(stream)!;
                    }

                    info.BannerExtention = bannerEx;
                }

                SetChannelData(id, info);
            }
            catch
            {
                throw new ServerException("Ошибка при сохранение файлов каналов", 500);
            }
        }

        public UserData GetUserData(int id)
        {
            return JsonSerializer.Deserialize<UserData>(File.ReadAllText(Path.Combine(UsersPath, $"{id}/info.json")))!;
        }
        public void SetUserData(int id, UserData data)
        {
            File.WriteAllText(Path.Combine(UsersPath, $"{id}/info.json"), JsonSerializer.Serialize(data));
        }

        /// <exception cref="ServerException"></exception>
        public async Task SaveUserFiles(int id, IFormFile? iconFile)
        {
            try
            {
                if (!Directory.Exists($"{UsersPath}/{id}"))
                    Directory.CreateDirectory($"{UsersPath}/{id}");

                if (iconFile == null)
                {
                    File.Copy($"{UsersPath}/template/icon.png", $"{UsersPath}/{id}/icon.png");

                    SetUserData(id, new UserData()
                    {
                        IconExtention = "png"
                    });
                }
                else
                {
                    string iconEx = iconFile.FileName.Split('.').Last();

                    string iconPath = $"{UsersPath}/{id}/icon.{iconEx}";

                    using (var stream = new FileStream(iconPath, FileMode.Create))
                    {
                        await iconFile.CopyToAsync(stream)!;
                    }

                    SetUserData(id, new UserData()
                    {
                        IconExtention = iconEx
                    });
                }
            }
            catch
            {
                throw new ServerException("Ошибка при сохранение файлов пользователя", 500);
            }
        }
    }
}
