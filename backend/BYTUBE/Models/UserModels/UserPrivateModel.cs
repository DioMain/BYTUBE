using BYTUBE.Entity.Models;

namespace BYTUBE.Models.UserModels
{
    public class UserPrivateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public User.RoleType Role { get; set; }

        public string IconUrl { get; set; }
    }
}
