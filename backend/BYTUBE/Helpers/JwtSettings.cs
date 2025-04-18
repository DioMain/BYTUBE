namespace BYTUBE.Helpers
{
    public class JwtSettings
    {
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public required int ExpiryMinutes { get; set; }
        public required string SecretKey { get; set; }
    }
}
