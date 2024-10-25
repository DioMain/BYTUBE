using BYTUBE.Models;

namespace BYTUBE.Exceptions
{
    public class ServerException : ApplicationException
    {
        public int Code { get; set; }

        public ServerException(string message, int code = 400) : base(message)
        {
            Code = code;
        }

        public ServerErrorModel GetModel()
        {
            var errorModel = new ServerErrorModel(Code);
            errorModel.errors.Add("ServerError", [Message]);

            return errorModel;
        }
    }
}
