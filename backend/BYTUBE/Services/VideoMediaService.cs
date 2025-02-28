using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics;
using Xabe.FFmpeg;

namespace BYTUBE.Services
{
    public class VideoMediaService
    {
        #region Resolution struct
        public struct Resolution
        {
            public int Width;
            public int Height;
        }
        #endregion

        private readonly string ffmpegPath;

        public VideoMediaService(string ffmpegPath)
        {
            this.ffmpegPath = ffmpegPath;

            FFmpeg.SetExecutablesPath(ffmpegPath);
        }

        public async Task<IMediaInfo> GetMediaInfo(string videoPath)
        {
            return await FFmpeg.GetMediaInfo(videoPath);
        }

        public async Task CompressVideo(string inputPath, string outputPath, Resolution resolution)
        {
            var args = $"-i \"{inputPath}\" -vf scale={resolution.Width}:{resolution.Height} -c:v libx264 -crf 28 -preset fast -c:a aac \"{outputPath}\"";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = args,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            await process.WaitForExitAsync();
        }
    }
}
