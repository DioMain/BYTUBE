using BYTUBE.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BYTUBE.Services
{
    public class JwtManager
    {
        public JwtSettings JwtSettings { get; private set; }

        public JwtManager(JwtSettings jwtSettings)
        {
            JwtSettings = jwtSettings;
        }

        public string GenerateJwtToken(string userId)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JwtSettings.SecretKey));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(JwtSettings.ExpiryMinutes),
                Issuer = JwtSettings.Issuer,
                Audience = JwtSettings.Audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
