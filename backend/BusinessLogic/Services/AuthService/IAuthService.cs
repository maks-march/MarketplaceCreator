using DataAccess.Models;
using Shared.DataTransferObjects.Request.AuthDto;
using Shared.DataTransferObjects.Request.UserDto;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.AuthService;

public interface IAuthService
{
    Task RegisterAsync(UserCreateDto request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task LogoutAsync(int userId, CancellationToken cancellationToken = default);
    Task<RefreshResponse> RefreshAsync(User user, CancellationToken cancellationToken = default);
    string GenerateJwtToken(UserSecureDto user);
}