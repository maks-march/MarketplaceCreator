using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]/")]
public class AuthController(IAuthService authService, IUserService userService) : NeedAuthController(userService)
{
    [HttpPost("register")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Register(UserCreateDto request)
    {
        var result = await authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await authService.LoginAsync(request);
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost("logout")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Logout([FromBody] string refreshToken)
    {
        await authService.LogoutAsync(refreshToken, GetCurrentUserId());
        return Ok();
    }

    [Authorize]
    [HttpGet("me")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> GetMe()
    {
        var result = await GetCurrentUser();
        return Ok(result);
    }
    
    [Authorize]
    [HttpPost("refresh")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<RefreshResponse>> Refresh([FromBody] RefreshRequest request)
    {
        var result = await authService.RefreshAsync(request, await GetCurrentUser());
        return Ok(result);
    }
}