using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using DataAccess.Models;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public class AuthService(IUserRepository userRepository, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(UserCreateDto request, CancellationToken cancellationToken = default)
    {
        if (await userRepository.GetFirstOrNullByUsername(request.Username, cancellationToken) != null)
            throw new ArgumentException("Пользователь с таким логином уже есть!");
        if (await userRepository.GetFirstOrNullByEmail(request.Email, cancellationToken) != null)
            throw new ArgumentException("Пользователь с такой почтой уже есть!");

        var user = User.Create(request);
        await userRepository.CreateAsync(user, cancellationToken);
        
        var token = GenerateJwtToken(user.GetSecuredDto());
        return new AuthResponse { Token = token, Username = user.Username };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var emailUser = await userRepository.GetSecureFirstOrNullByEmail(request.Email, cancellationToken);
        var nameUser = await userRepository.GetSecureFirstOrNullByUsername(request.Email, cancellationToken);

        if (AuthentificateUser(emailUser, request, out var response) && response != null)
            return response;
        
        if (AuthentificateUser(nameUser, request, out response) && response != null)
            return response;

        if (emailUser is null && nameUser is null)
            throw new AuthenticationException("Такого пользователя не существует");
        
        throw new AuthenticationException("Неправильный логин или пароль!");
    }

    private bool AuthentificateUser(UserSecureDto? user, LoginRequest request, out AuthResponse? response)
    {
        response = null;
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return false;

        var token = GenerateJwtToken(user);
        response = new AuthResponse { Token = token, Username = user.Username };
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
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}