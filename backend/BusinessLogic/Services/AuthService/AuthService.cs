using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using DataAccess.Models;
using DataAccess.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class AuthService(IUserRepository userRepository, IRefreshTokenRepository tokenRepository, IConfiguration configuration) : IAuthService
{
    public async Task RegisterAsync(UserCreateDto request, CancellationToken cancellationToken = default)
    {
        if (await userRepository.GetFirstOrNullByUsername(request.Username, cancellationToken) != null)
            throw new ArgumentException("Пользователь с таким логином уже есть!");
        if (await userRepository.GetFirstOrNullByEmail(request.Email, cancellationToken) != null)
            throw new ArgumentException("Пользователь с такой почтой уже есть!");

        var user = User.Create(request);
        var refreshToken = GenerateJwtRefreshToken(user.GetSecuredDto());
        var tokenEntity = RefreshToken.Create(refreshToken);
        user.RefreshToken = tokenEntity;
        await userRepository.CreateAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var emailUser = await userRepository.GetSecureFirstOrNullByEmail(request.EmailOrUsername, cancellationToken);
        var nameUser = await userRepository.GetSecureFirstOrNullByUsername(request.EmailOrUsername, cancellationToken);
        
        if (emailUser is null && nameUser is null)
            throw new AuthenticationException("Неправильный логин или пароль!");
        UserSecureDto? user = null;
        if (AuthentificateUser(emailUser, request))
        {
            user = emailUser;
        }

        if (AuthentificateUser(nameUser, request))
        {
            user = nameUser;
        }

        if (user != null)
        {
            var token = GenerateJwtToken(user);
            var newRefreshToken = GenerateJwtRefreshToken(user);
            var tokenEntity = await tokenRepository.GetByIdAsync(user.RefreshTokenId, cancellationToken);
            if (tokenEntity == null)
                throw new Exception("Скорее всего ты удален ;)");
            await tokenRepository.UpdateAsync(tokenEntity, newRefreshToken, cancellationToken);
            return new AuthResponse { AccessToken = token, RefreshToken = newRefreshToken, User = user };
        }
        throw new AuthenticationException("Неправильный логин или пароль!");
    }

    public async Task LogoutAsync(string refreshToken, int userId, CancellationToken cancellationToken = default)
    {
        var refreshTokenEntity = await tokenRepository.GetByTokenAsync(refreshToken, cancellationToken);
        if (refreshTokenEntity == null)
            throw new NotFoundException("Неверный токен!");
        if (refreshTokenEntity.User.Id != userId)
            throw new AuthenticationException("Данный пользователь не может разрушить этот токен");
        await tokenRepository.DeleteAsync(refreshTokenEntity, cancellationToken);
    }

    public async Task<RefreshResponse> RefreshAsync(RefreshRequest request, User user, CancellationToken cancellationToken = default)
    {
        var refreshToken = await tokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);
        if (refreshToken == null || refreshToken != user.RefreshToken)
            throw new NotFoundException("Неверный токен!");
        if (refreshToken.Expires > DateTime.UtcNow)
            throw new InvalidOperationException("Токен просрочен!");
        if (refreshToken.User.Id != user.Id)
            throw new AuthenticationException("Данный пользователь не может обновить этот токен");
        
        var token = GenerateJwtToken(user.GetSecuredDto());
        var newRefreshToken = GenerateJwtRefreshToken(user.GetSecuredDto());
        await tokenRepository.UpdateAsync(refreshToken, newRefreshToken, cancellationToken);
        return new RefreshResponse()
        {
            AccessToken = token,
            RefreshToken = newRefreshToken
        };
    }

    private bool AuthentificateUser(UserSecureDto? user, LoginRequest request)
    {
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return false;
        return true;
    }

    public string GenerateJwtToken(UserSecureDto user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            configuration["Jwt:Key"] ?? "default-secret-key-min-32-chars-long-123456789"));
        var issuer = configuration["Jwt:Issuer"] ?? "marketplace-api";
        var audience = configuration["Jwt:Audience"] ?? "marketplace-users"; 
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public string GenerateJwtRefreshToken(UserSecureDto user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            configuration["Jwt:Key"] ?? "default-secret-key-min-32-chars-long-123456789"));
        var issuer = configuration["Jwt:Issuer"] ?? "marketplace-api";
        var audience = configuration["Jwt:Audience"] ?? "marketplace-users"; 
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(20),
            signingCredentials: creds);

        return token.EncodedPayload;
    }
}