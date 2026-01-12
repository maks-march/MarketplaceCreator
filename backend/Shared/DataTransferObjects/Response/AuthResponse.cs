namespace Shared.DataTransferObjects.Response;

public class AuthResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required UserDto User { get; set; }
}