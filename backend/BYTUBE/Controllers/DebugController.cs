using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [Route("api/debug")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        [HttpGet]
        public IResult Get()
        {
            return Results.Text("IS WORK!", "text/plane");
        }
    }
}
