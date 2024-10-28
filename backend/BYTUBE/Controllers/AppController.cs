using Microsoft.AspNetCore.Mvc;

namespace BYTUBE.Controllers
{
    [ApiController]
    public class AppController : ControllerBase
    {
        public AppController()
        {

        }

        private IResult GetView()
        {
            return Results.Text(System.IO.File.ReadAllText("./Public/index.html"), contentType: "text/html");
        }

        [HttpGet, Route("/App/Main")]
        public IResult GetPage0()
        {
            return GetView();
        }

        [HttpGet, Route("/App/Video")]
        public IResult GetPage1()
        {
            return GetView();
        }

        [HttpGet, Route("/Auth/Signin")]
        public IResult GetPage2()
        {
            return GetView();
        }

        [HttpGet, Route("/Auth/Register")]
        public IResult GetPage3()
        {
            return GetView();
        }
    }
}
