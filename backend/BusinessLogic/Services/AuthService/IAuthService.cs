using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(UserCreateDto request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task LogoutAsync(string refreshToken, int userId, CancellationToken cancellationToken = default);
    Task<RefreshResponse> RefreshAsync(RefreshRequest request, User user, CancellationToken cancellationToken = default);
    string GenerateJwtToken(UserSecureDto user);
}