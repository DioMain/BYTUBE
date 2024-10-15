using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [ApiController]
    public class AppController : ControllerBase
    {
        public AppController()
        {

        }

        [HttpGet, Route("/App")]
        public IResult GetPage()
        {
            return Results.Text(System.IO.File.ReadAllText("./Public/index.html"), contentType: "text/html");
        }
    }
}
