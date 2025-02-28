using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly PostgresDbContext _db;

        private Guid UserId => Guid.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private User.RoleType Role => Enum.Parse<User.RoleType>(HttpContext.User.Claims.ToArray()[1].Value);
        private bool IsAutorize => HttpContext.User.Claims.Any();

        public ReportController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet, Authorize]
        public async Task<IResult> Get([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                var report = await _db.Reports.FindAsync(guid)
                    ?? throw new ServerException("Репорт не найден", 404);

                return Results.Json(new ReportModel()
                {
                    Id = id,
                    Description = report.Description,
                    Type = report.Type,
                    VideoGuid = report.VideoId.ToString(),
                    Created = report.Created,
                });
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpPost, Authorize]
        public async Task<IResult> Post([FromBody] ReportModel model)
        {
            try
            {
                if (!Guid.TryParse(model.VideoGuid, out Guid vguid))
                    throw new ServerException("id is not correct!");

                _db.Reports.Add(new Report()
                {
                    VideoId = vguid,
                    Description = model.Description,
                    Type = model.Type,
                    Created = DateTime.UtcNow
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete, Authorize(Roles = "Admin")]
        public async Task<IResult> Delete([FromQuery] string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid guid))
                    throw new ServerException("id is not correct!");

                var report = await _db.Reports.FindAsync(guid) 
                    ?? throw new ServerException("Репорт не найден", 404);

                _db.Reports.Remove(report);

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpGet("video"), Authorize]
        public async Task<IResult> GetVideoReports([FromQuery] string vid)
        {
            try
            {
                if (!Guid.TryParse(vid, out Guid guid))
                    throw new ServerException("id is not correct!");

                var reports = await _db.Reports.Where(r => r.VideoId == guid).ToArrayAsync();

                return Results.Json(reports.Select(report => new ReportModel()
                {
                    Id = report.Id.ToString(),
                    Description = report.Description,
                    Type = report.Type,
                    VideoGuid = report.VideoId.ToString(),
                    Created = report.Created,
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
