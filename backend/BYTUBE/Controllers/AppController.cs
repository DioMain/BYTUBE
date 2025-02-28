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

        [HttpGet, Route("/")]
        public IResult GetPageRed0()
        {
            return Results.Redirect("/App/Main");
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

        [HttpGet, Route("/Studio")]
        public IResult GetPage4()
        {
            return GetView();
        }

        [HttpGet, Route("/Admin")]
        public IResult GetPage5()
        {
            return GetView();
        }

        [HttpGet, Route("/App/Search")]
        public IResult GetPage6()
        {
            return GetView();
        }

        [HttpGet, Route("/App/Channel")]
        public IResult GetPage7()
        {
            return GetView();
        }
    }
}
