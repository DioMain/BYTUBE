using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [ApiController]
    public class MainController : ControllerBase
    {
        public MainController()
        {

        }

        [HttpGet, Route("/App")]
        public IResult GetPage()
        {
            return Results.Text(System.IO.File.ReadAllText("./Public/index.html"), contentType: "text/html");
        }
    }
}
