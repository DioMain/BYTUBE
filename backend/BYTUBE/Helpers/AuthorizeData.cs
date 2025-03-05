using BYTUBE.Entity.Models;
using System.Security.Claims;

namespace BYTUBE.Helpers
{
    public class AuthorizeData
    {
        public Guid Id { get; private set; }
        public User.RoleType Role { get; private set; }
        public bool IsAutorize { get; private set; }

        public AuthorizeData()
        {
            Id = Guid.NewGuid();
            Role = User.RoleType.User;
            IsAutorize = false;
        }

        public AuthorizeData(Guid id, User.RoleType role, bool isAutorize)
        {
            Id = id;
            Role = role;
            IsAutorize = isAutorize;
        }

        public static AuthorizeData FromContext(HttpContext context)
        {
            bool IsAutorize = context.User.Claims.Any();

            if (!IsAutorize)
                return new AuthorizeData();

            Guid UserId = Guid.Parse(context.User.Claims.ToArray()[0].Value);
            
            User.RoleType Role = Enum.Parse<User.RoleType>(context.User.Claims.ToArray()[1].Value);

            return new AuthorizeData(UserId, Role, IsAutorize);
        }

        public static AuthorizeData FromClaims(ClaimsPrincipal? claims)
        {
            if (claims == null)
                return new AuthorizeData();

            Guid UserId = Guid.Parse(claims.Claims.ToArray()[0].Value);

            User.RoleType Role = Enum.Parse<User.RoleType>(claims.Claims.ToArray()[1].Value);

            return new AuthorizeData(UserId, Role, true);
        }
    }
}
