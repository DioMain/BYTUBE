﻿using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Helpers;
using BYTUBE.Models;
using BYTUBE.Models.ChannelModels;
using BYTUBE.Models.VideoModels;
using BYTUBE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly PostgresDbContext _dbContext;
        private readonly LocalDataService _localData;
        private readonly VideoMediaService _videoMedia;

        public VideoController(PostgresDbContext db, LocalDataService localData, VideoMediaService videoMedia)
        {
            _dbContext = db;
            _localData = localData;
            _videoMedia = videoMedia;
        }

        [HttpGet]
        public async Task<IResult> Get([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Video video = await _dbContext.Videos.FindAsync(id) 
                    ?? throw new ServerException("Видео не найдено", 404);

                Channel channel = await _dbContext.Channels
                    .Include(i => i.Subscribes)
                    .FirstAsync(i => i.Id == video.ChannelId);

                if (video.VideoAccess == Video.Access.Private)
                {
                    if (!authData.IsAutorize || channel.UserId != authData.Id)
                        throw new ServerException("Видео вам не доступно", 403);
                }

                if (video.VideoStatus == Video.Status.Blocked || channel.Status == Channel.ActiveStatus.Blocked)
                    throw new ServerException("Видео более не доспутно", 403);

                var videoLocalData = _localData.GetVideoData(id);
                var channelLocalData = _localData.GetChannelData(channel.Id);

                var views = await _dbContext.VideoViews.Where(v => v.VideoId == id).CountAsync();

                VideoFullModel model = new()
                {
                    Id = video.Id.ToString(),
                    Title = video.Title,
                    Description = video.Description ?? "",
                    Duration = video.Duration,
                    Created = video.Created,
                    Views = views,
                    Tags = video.Tags,
                    VideoUrl = $"/data/videos/{id}/video.{videoLocalData.VideoExtention}",
                    PreviewUrl = $"/data/videos/{id}/preview.{videoLocalData.PreviewExtention}",
                    VideoAccess = video.VideoAccess,
                    VideoStatus = video.VideoStatus,
                    ForAdults = video.ForAdults,

                    Channel = new()
                    {
                        Id = channel.Id.ToString(),
                        Name = channel.Name,
                        IsSubscripted = false,
                        Subscribes = channel.Subscribes.Count,
                        Status = channel.Status,
                        IconUrl = $"/data/channels/{channel.Id}/icon.{channelLocalData.IconExtention}"
                    }
                };

                if (authData.IsAutorize)
                {
                    model.Channel.IsSubscripted = channel.Subscribes.Any(i => i.UserId == authData.Id);
                }

                return Results.Json(model);
            }
            catch (ServerException srverr)
            {
                return Results.Json(srverr.GetModel(), statusCode: srverr.Code);
            }
            catch
            {
                return Results.Problem(statusCode: 400);
            }
        }

        [HttpGet("channel")]
        public async Task<IResult> GetChannelVideos([FromQuery] Guid channelId)
        {
            try
            {
                Video[] videos = await _dbContext.Videos
                    .Where(
                    item => item.ChannelId == channelId &&
                    item.VideoStatus != Video.Status.Blocked &&
                    item.VideoAccess == Video.Access.All)
                    .Include(video => video.Channel)
                    .Include(video => video.Views)
                    .OrderByDescending(i => i.Created)
                    .ToArrayAsync();

                List<VideoModel> models = [];
                foreach (Video video in videos)
                {
                    var videoLocalData = _localData.GetVideoData(video.Id);
                    var channelLocalData = _localData.GetChannelData(video.Channel!.Id);

                    VideoModel videoModel = new VideoModel()
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Description = video.Description,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = video.Views.Count,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        ForAdults = video.ForAdults,
                        Channel = new ChannelModel()
                        {
                            Id = video.Channel.Id.ToString(),
                            Name = video.Channel.Name,
                            Subscribes = video.Channel.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Channel!.Id}/icon.{channelLocalData.IconExtention}"
                        }
                    };

                    models.Add(videoModel);
                }

                return Results.Json(models);
            }
            catch
            {
                return Results.Problem(statusCode: 400);
            }
        }

        [HttpGet("playlist")]
        public async Task<IResult> GetPlaylistVideos([FromQuery] Guid playlistId)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                Playlist? playlist = await _dbContext.Playlists
                    .Include(pl => pl.PlaylistItems)
                        .ThenInclude(item => item.Video)
                            .ThenInclude(video => video.Channel)
                    .FirstOrDefaultAsync(pl => pl.Id == playlistId)
                    ?? throw new ServerException("Плейлист не найден!", 404);

                if (playlist.Access == Playlist.AccessType.Private)
                {
                    if (authData.IsAutorize)
                    {
                        if (authData.Id != playlist.UserId)
                            throw new ServerException("Видео плейлиста не доступены!", 403);
                    }
                    else
                        throw new ServerException("Не авторизован!", 401);
                }

                return Results.Json(playlist.PlaylistItems.Select(item => item.Video).Select(video =>
                {
                    var videoLocalData = _localData.GetVideoData(video.Id);
                    var channelLocalData = _localData.GetChannelData(video.Channel!.Id);

                    var views = _dbContext.VideoViews.Where(view => view.VideoId == video.Id).Count();

                    var videoModel = new VideoModel()
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Description = video.Description,
                        Duration = video.Duration,
                        Created = video.Created,
                        Views = views,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoLocalData.PreviewExtention}",
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Channel = new ChannelModel()
                        {
                            Id = video.Channel.Id.ToString(),
                            Name = video.Channel.Name,
                            Subscribes = video.Channel!.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Channel!.Id}/icon.{channelLocalData.IconExtention}"
                        }
                    };

                    return videoModel;
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(detail: err.Message, statusCode: 400);
            }
        }

        [HttpGet("select")]
        public async Task<IResult> Select([FromQuery] SelectOptions options)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                var tagPattern = @"#\w+";
                var tags = Regex.Matches(options.SearchPattern, tagPattern)
                                .Cast<Match>()
                                .Select(m => m.Value[1..])
                                .ToList();

                var searchPatternNoTags = Regex.Replace(options.SearchPattern, tagPattern, "").Trim();

                var query = _dbContext.Videos
                    .Include(Video => Video.Marks)
                    .Include(Video => Video.Views)
                    .Include(video => video.Channel)
                        .ThenInclude(o => o.Subscribes)
                    .Include(video => video.Reports)
                    .AsQueryable();


                if (!(options.AsAdmin && authData.IsAutorize && authData.Role == Entity.Models.User.RoleType.Admin))
                {
                    query = query.Where(video => video.VideoAccess == Video.Access.All);

                    if (options.OnlyUnlimited)
                        query = query.Where(
                            video => video.VideoStatus == Video.Status.NoLimit 
                         && video.Channel.Status == Channel.ActiveStatus.Normal);
                    else
                        query = query.Where(video => 
                            (video.VideoStatus == Video.Status.NoLimit || video.VideoStatus == Video.Status.Limited)
                         && (video.Channel.Status == Channel.ActiveStatus.Normal || video.Channel.Status == Channel.ActiveStatus.Limited));
                }

                if (!string.IsNullOrEmpty(options.Ignore))
                {
                    var ignoredIds = options.Ignore.Split(',').Select(Guid.Parse);
                    query = query.Where(video => !ignoredIds.Contains(video.Id));
                }

                if (!string.IsNullOrEmpty(searchPatternNoTags))
                {
                    query = query.Where(video => Regex.IsMatch(video.Title, $@"(\w)*{searchPatternNoTags}(\w)*"));
                }

                if (authData.IsAutorize)
                {
                    var user = await _dbContext.Users.FirstAsync(i => i.Id == authData.Id);

                    if (options.OnlyAllAges)
                    {
                        query = query.Where(video => !video.ForAdults);
                    }

                    if (options.Subscribes)
                    {
                        query = query.Where(video => video.Channel!.Subscribes.Any(sub => sub.UserId == authData.Id));
                    }

                    if (options.Favorite)
                    {
                        query = query.Where(video => video.Marks.Any(mark => mark.UserId == user.Id && mark.IsLike));
                    }
                }

                query = options.OrderBy switch
                {
                    SelectOrderBy.Creation => query.OrderBy(video => video.Created),
                    SelectOrderBy.CreationDesc => query.OrderByDescending(video => video.Created),
                    SelectOrderBy.Reports => query.OrderBy(video => video.Reports.Count),
                    SelectOrderBy.ReportsDesc => query.OrderByDescending(video => video.Reports.Count),
                    SelectOrderBy.Views => query.OrderByDescending(video => video.Views.Count),
                    _ => query
                };

                var videos = await query.ToListAsync();

                if (tags.Count != 0)
                {
                    videos = videos.Where(video => video.Tags.Any(vtag => tags.Contains(vtag))).ToList();
                }

                videos = videos.Skip(options.Skip).Take(options.Take).ToList();

                var result = videos.Select(video =>
                {
                    var videoData = _localData.GetVideoData(video.Id);
                    var channelData = _localData.GetChannelData(video.Channel!.Id);

                    return new VideoModel
                    {
                        Id = video.Id.ToString(),
                        Title = video.Title,
                        Duration = video.Duration,
                        Created = video.Created,
                        VideoAccess = video.VideoAccess,
                        VideoStatus = video.VideoStatus,
                        Views = video.Views.Count,
                        ReportsCount = video.Reports.Count,
                        ForAdults = video.ForAdults,
                        Description = video.Description,
                        PreviewUrl = $"/data/videos/{video.Id}/preview.{videoData.PreviewExtention}",
                        Channel = new ChannelModel
                        {
                            Id = video.Channel.Id.ToString(),
                            Name = video.Channel.Name,
                            IsSubscripted = false,
                            Subscribes = video.Channel.Subscribes.Count,
                            IconUrl = $"/data/channels/{video.Channel.Id}/icon.{channelData.IconExtention}"
                        }
                    };
                });

                return Results.Json(result);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromForm] CreateVideoModel model, [FromQuery] Guid channelId)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == channelId && c.UserId == authData.Id))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                var video = await _dbContext.Videos.AddAsync(new Video()
                {
                    Title = model.Title,
                    Description = model.Description,
                    Created = DateTime.Now.ToUniversalTime(),
                    Tags = model.Tags,
                    Duration = "00:00",
                    ChannelId = channelId,
                    VideoAccess = model.VideoAccess,
                    VideoStatus = model.VideoStatus,
                    ForAdults = model.ForAdults
                });

                await _dbContext.SaveChangesAsync();

                await _localData.SaveVideoFiles(video.Entity.Id, model.PreviewFile!, model.VideoFile!);

                var localVideoData = _localData.GetVideoData(video.Entity.Id);

                var videoInfo = await _videoMedia
                    .GetMediaInfo($"{LocalDataService.VideosPath}/{video.Entity.Id}/video.{localVideoData.VideoExtention}");

                int minutes = (int)Math.Floor(videoInfo.Duration.TotalSeconds / 60);
                int secound = (int)videoInfo.Duration.TotalSeconds - (minutes * 60);

                string minutesString = minutes.ToString();
                string secoundsString = secound.ToString();

                minutesString = minutesString.Length == 1 ? $"0{minutesString}" : minutesString;
                secoundsString = secoundsString.Length == 1 ? $"0{secoundsString}" : secoundsString;

                video.Entity.Duration = $"{minutesString}:{secoundsString}";

                _dbContext.Videos.Update(video.Entity);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }
        }

        [HttpPut, Authorize]
        public async Task<IResult> Put([FromForm] EditVideoModel model, [FromQuery] Guid id, [FromQuery] Guid channelId)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == channelId && c.UserId == authData.Id))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video video = await _dbContext.Videos.FindAsync(id)
                    ?? throw new ServerException("Видео не существует", 404);

                if (video.ChannelId != channelId)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                video.Title = model.Title;
                video.Description = model.Description;
                video.Tags = model.Tags;
                video.VideoAccess = model.VideoAccess;
                video.ForAdults = model.ForAdults;

                if (model.PreviewFile != null)
                    await _localData.SaveVideoFiles(video.Id, model.PreviewFile!);

                _dbContext.Videos.Update(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch
            {
                return Results.Problem("Error", statusCode: 400);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] Guid id, [FromQuery] Guid channelId)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (!await _dbContext.Channels.AnyAsync(c => c.Id == channelId && c.UserId == authData.Id))
                    throw new ServerException("Канал вам не пренадлежит", 403);

                Video? video = await _dbContext.Videos.FindAsync(id)
                    ?? throw new ServerException("Видео не существует", 404);

                if (video.ChannelId != channelId)
                    throw new ServerException("Видео вам не пренадлежит", 403);

                Directory.Delete($"{LocalDataService.VideosPath}/{id}", true);

                _dbContext.Videos.Remove(video);
                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch
            {
                return Results.Problem("Error", statusCode: 400);
            }
        }

        [HttpGet("/data/videos/{id:guid}/video.mp4")]
        public async Task<IResult> StreamVideo([FromRoute] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                string path = $"./Data/videos/{id}/video.mp4";

                if (!System.IO.File.Exists(path))
                    throw new ServerException("Файла больше не существует!", 404);

                Video video = await _dbContext.Videos
                    .Include(i => i.Channel)
                    .FirstAsync(i => i.Id == id);

                if (video.VideoAccess == Video.Access.Private)
                {
                    if ((authData.IsAutorize && authData.Id != video.Channel.UserId) || !authData.IsAutorize)
                        throw new ServerException("Видео файл не доступен!", 403);
                }

                if (video.VideoStatus == Video.Status.Blocked)
                    throw new ServerException("Видео файл не доступен!", 403);

                HttpContext.Response.Headers.Append("Accept-Ranges", "bytes");

                var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read | FileShare.Delete);
                var fileLength = fileStream.Length;

                if (Request.Headers.ContainsKey("Range"))
                {
                    var rangeHeader = Request.Headers["Range"].ToString();
                    var range = rangeHeader.Replace("bytes=", "").Split('-');
                    var start = long.Parse(range[0]);
                    var end = range.Length > 1 && !string.IsNullOrEmpty(range[1])
                        ? long.Parse(range[1])
                        : fileLength - 1;

                    var chunkSize = end - start + 1;
                    fileStream.Seek(start, SeekOrigin.Begin);

                    return Results.File(
                        fileStream,
                        "video/mp4",
                        enableRangeProcessing: true);
                }

                return Results.File(fileStream, "video/mp4");
            }
            catch (ServerException srvErr)
            {
                return Results.Json(srvErr.GetModel(), statusCode: srvErr.Code);
            }
            catch (Exception err)
            {
                return Results.Problem(err.Message, statusCode: 400);
            }
        }

        [HttpGet("mark")]
        public async Task<IResult> GetMark([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                var video = await _dbContext.Videos
                    .Include(video => video.Marks)
                    .FirstOrDefaultAsync(video => video.Id == id)
                    ?? throw new ServerException("Видео не найдено", 404);

                VideoMarkModel model = new()
                {
                    LikesCount = video.Marks.Count(mark => mark.IsLike),
                    DislikesCount = video.Marks.Count(mark => mark.IsDisLike)
                };

                if (authData.IsAutorize)
                {
                    model.UserIsLikeIt = video.Marks.Any(mark => mark.UserId == authData.Id && mark.IsLike);
                    model.UserIsDislikeIt = video.Marks.Any(mark => mark.UserId == authData.Id && mark.IsDisLike);
                }

                return Results.Json(model);
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("mark"), Authorize]
        public async Task<IResult> MarkVideo([FromQuery] Guid id, [FromQuery] bool isLike)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                var video = await _dbContext.Videos
                    .FindAsync(id)
                    ?? throw new ServerException("Видео не найдено", 404);

                var user = await _dbContext.Users
                    .FirstAsync(usr => usr.Id == authData.Id);

                var mark = await _dbContext.VideoMarks
                    .FirstOrDefaultAsync(mark => mark.VideoId == id && mark.UserId == user.Id);

                if (mark is not null)
                {
                    if (isLike)
                    {
                        mark.IsLike = !mark.IsLike;
                        mark.IsDisLike = false;
                    }
                    else
                    {
                        mark.IsLike = false;
                        mark.IsDisLike = !mark.IsDisLike;
                    }

                    mark.Updated = DateTime.UtcNow;
                }
                else
                {
                    await _dbContext.VideoMarks.AddAsync(new()
                    {
                        UserId = user.Id,
                        VideoId = video.Id,
                        Updated = DateTime.UtcNow,
                        IsLike = isLike,
                        IsDisLike = !isLike
                    });
                }

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost("view")]
        public async Task<IResult> AddView([FromQuery] Guid id)
        {
            try
            {
                var video = await _dbContext.Videos.FindAsync(id)
                    ?? throw new ServerException("Video not found!", 404);

                var authData = AuthorizeData.FromContext(HttpContext);

                _dbContext.VideoViews.Add(new()
                {
                    UserId = authData.IsAutorize ? authData.Id : null,
                    VideoId = id,
                    Created = DateTime.UtcNow
                });

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("view")]
        public async Task<IResult> GetViews([FromQuery] Guid id)
        {
            try
            {
                var video = await _dbContext.Videos
                    .Include(v => v.Views)
                    .FirstOrDefaultAsync(v => v.Id == id)
                    ?? throw new ServerException("Video not found!", 404);

                return Results.Json(video.Views.Select(view =>
                {
                    return new VideoViewModel()
                    {
                        Id = view.Id,
                        UserId = view.UserId,
                        VideoId = id,
                        Created = view.Created
                    };
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete("delete"), Authorize(Roles = "Admin")]
        public async Task<IResult> DeleteByAdmin([FromQuery] Guid id)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (authData.Role != Entity.Models.User.RoleType.Admin)
                    throw new ServerException("Вы не администратор!", 403);

                var video = await _dbContext.Videos
                    .Include(i => i.Channel)
                    .FirstOrDefaultAsync(x => x.Id == id) 
                    ?? throw new ServerException("Видео не найдена!", 404);

                Directory.Delete($"{LocalDataService.VideosPath}/{id}", true);

                _dbContext.Videos.Remove(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Json(err.Message, statusCode: 500);
            }
        }

        [HttpPut("status"), Authorize(Roles = "Admin")]
        public async Task<IResult> ChangeStatusByAdmin([FromQuery] Guid id, [FromQuery] Video.Status status)
        {
            try
            {
                var authData = AuthorizeData.FromContext(HttpContext);

                if (authData.Role != Entity.Models.User.RoleType.Admin)
                    throw new ServerException("Вы не администратор!", 403);

                var video = await _dbContext.Videos.FindAsync(id)
                    ?? throw new ServerException("Видео не найдена!", 404);

                video.VideoStatus = status;

                _dbContext.Videos.Update(video);

                await _dbContext.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
            catch (Exception err)
            {
                return Results.Json(err.Message, statusCode: 500);
            }
        }
    }
}
