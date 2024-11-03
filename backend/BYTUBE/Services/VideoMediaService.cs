using Xabe.FFmpeg;

namespace BYTUBE.Services
{
    public class VideoMediaService
    {
        public VideoMediaService(string ffmpegPath)
        {
            FFmpeg.SetExecutablesPath(ffmpegPath);
        }

        public async Task<IMediaInfo> GetMediaInfo(string videoPath)
        {
            return await FFmpeg.GetMediaInfo(videoPath);
        }
    }
}
