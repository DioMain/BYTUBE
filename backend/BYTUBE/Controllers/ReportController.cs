using BYTUBE.Entity.Models;
using BYTUBE.Exceptions;
using BYTUBE.Models.ReportModels;
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

        private int UserId => int.Parse(HttpContext.User.Claims.ToArray()[0].Value);
        private User.RoleType Role => Enum.Parse<User.RoleType>(HttpContext.User.Claims.ToArray()[1].Value);
        private bool IsAutorize => HttpContext.User.Claims.Any();

        public ReportController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet, Authorize]
        public async Task<IResult> Get([FromQuery] int id)
        {
            try
            {
                var report = await _db.Reports.FirstOrDefaultAsync(r => r.Id == id);

                if (report == null)
                    throw new ServerException("Репорт не найден", 404);

                return Results.Json(new ReportModel()
                {
                    Id = id,
                    Description = report.Description,
                    Type = report.Type,
                    VideoId = report.VideoId,
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
                _db.Reports.Add(new Report()
                {
                    VideoId = model.VideoId,
                    Description = model.Description,
                    Type = model.Type,
                });

                await _db.SaveChangesAsync();

                return Results.Ok();
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }

        [HttpDelete, Authorize]
        public async Task<IResult> Delete([FromQuery] int id)
        {
            try
            {
                var report = _db.Reports.FirstOrDefault(r => r.Id == id);

                if (report == null)
                    throw new ServerException("Репорт не найден", 404);

                if (Role != Entity.Models.User.RoleType.Admin)
                    throw new ServerException("Admin only", 403);

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
        public async Task<IResult> GetVideoReports([FromQuery] int vid)
        {
            try
            {
                var reports = await _db.Reports.Where(r => r.VideoId == vid).ToArrayAsync();

                return Results.Json(reports.Select(report => new ReportModel()
                {
                    Id = report.Id,
                    Description = report.Description,
                    Type = report.Type,
                    VideoId = report.VideoId,
                }));
            }
            catch (ServerException err)
            {
                return Results.Json(err.GetModel(), statusCode: err.Code);
            }
        }
    }
}
