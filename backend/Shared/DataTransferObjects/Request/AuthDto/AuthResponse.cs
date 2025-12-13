using Shared.DataTransferObjects.Response;

namespace DataAccess.Models;

public class AuthResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required UserDto User { get; set; }
}