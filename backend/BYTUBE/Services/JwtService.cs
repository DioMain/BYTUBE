using BYTUBE.Entity.Models;
using BYTUBE.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BYTUBE.Services
{
    public class JwtService
    {
        #region UserData struct
        public struct UserData
        {
            public Guid Id;
            public User.RoleType Role;
        }
        #endregion

        public JwtSettings AccessToken { get; private set; }
        public JwtSettings RefreshToken { get; private set; }

        public CookieOptions JwtCookieOptions { get; private set; }

        public JwtService(JwtSettings accessToken, JwtSettings refreshToken)
        {
            RefreshToken = refreshToken;
            AccessToken = accessToken;

            JwtCookieOptions = new CookieOptions()
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                MaxAge = TimeSpan.FromMinutes(120)
            };
        }

        public static string GenerateJwtToken(JwtSettings settings, UserData user)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(settings.SecretKey));

            var claims = new[]
            {
                new Claim(ClaimTypes.UserData, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(settings.ExpiryMinutes),
                Issuer = settings.Issuer,
                Audience = settings.Audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public static TokenValidationParameters GetParameters(JwtSettings settings)
        {
            byte[] key = Encoding.ASCII.GetBytes(settings.SecretKey);

            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = settings.Issuer,
                ValidAudience = settings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };
        }

        public static ClaimsPrincipal? ValidateToken(string token, TokenValidationParameters parameters)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                return tokenHandler.ValidateToken(token, parameters, out SecurityToken validatedToken);
            }
            catch
            {
                return null;
            }
        }

        public static bool TryValidateToken(string token, TokenValidationParameters parameters, out ClaimsPrincipal claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                claims = tokenHandler.ValidateToken(token, parameters, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                claims = new ClaimsPrincipal();

                return false;
            }
        }
    }
}
