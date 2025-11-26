using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(UserCreateDto request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    string GenerateJwtToken(UserSecureDto user);
}