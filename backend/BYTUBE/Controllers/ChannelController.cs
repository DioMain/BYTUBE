using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly PostgresDbContext _db;

        public ChannelController(PostgresDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IResult Get()
        {
            return Results.Ok();
        }

        [HttpGet("channel")]
        public IResult GetChannel()
        {
            return Results.Ok();
        }
    }
}
