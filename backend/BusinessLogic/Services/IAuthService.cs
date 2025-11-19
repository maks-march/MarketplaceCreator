using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;

namespace BusinessLogic.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    string GenerateJwtToken(User user);
}