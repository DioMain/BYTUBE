using BYTUBE.Services;
using BYTUBE.Entity.Models;
using BYTUBE.Models;
using System.Security.Claims;

namespace BYTUBE_Tests
{
    public class Tests
    {

        private readonly JwtManager jwtManager = new JwtManager(new JwtSettings()
        {
            Audience = "http://localhost:8081/api",
            Issuer = "http://localhost:8081",
            SecretKey = "N0ek5pYWMgnq-iaCqz811YNsxNFkhTb8oNEFooIyHBg",
            ExpiryMinutes = 1,
        },
            new JwtSettings()
            {
                Audience = "http://localhost:8081/api",
                Issuer = "http://localhost:8081",
                SecretKey = "N0ek5pYWMgnq-iaCqz811YNsxNFkhTb8oNEFooIyHBf",
                ExpiryMinutes = 2,
            });

        [Fact]
        public void PasswordHasherTest0()
        {
            PasswordHasher hasher = new PasswordHasher("salt");

            string passwordHashed = hasher.Hash("pravoda01");

            Assert.True(hasher.Hash("pravoda01") == passwordHashed);
        }

        [Fact]
        public void PasswordHasherTest1()
        {
            PasswordHasher hasher = new PasswordHasher("salt");

            string passwordHashed = hasher.Hash("pravoda01");

            Assert.False(hasher.Hash("Pravoda01") == passwordHashed);
        }

        [Fact]
        public void JwtManagerTest0()
        {
            string token = JwtManager.GenerateJwtToken(jwtManager.AccessToken, new User()
            {
                Id = 12,
                Name = "Test",
                Role = User.RoleType.User
            });

            ClaimsPrincipal claims = JwtManager.ValidateToken(token, JwtManager.GetParameters(jwtManager.AccessToken));

            Assert.Equal("12", claims.Claims.First().Value);
        }

        [Fact]
        public void JwtManagerTest1()
        {
            string token = JwtManager.GenerateJwtToken(jwtManager.RefreshToken, new User()
            {
                Id = 13,
                Name = "Testsad",
                Role = User.RoleType.User
            });

            ClaimsPrincipal claims = JwtManager.ValidateToken(token, JwtManager.GetParameters(jwtManager.RefreshToken));

            Assert.Equal("13", claims.Claims.First().Value);
        }

        [Fact]
        public void VideoMediaServiceTest()
        {
            VideoMediaService videoMedia = new VideoMediaService("C:\\ffmpeg");

            var data = videoMedia.GetMediaInfo("D:\\BYData\\GAMBLECORE.mp4");

            Assert.NotNull(data);
        }
    }
}