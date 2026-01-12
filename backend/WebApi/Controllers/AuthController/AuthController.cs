using BusinessLogic.Services.AuthService;
using BusinessLogic.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.AuthDto;
using Shared.DataTransferObjects.Request.UserDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllerrs;

namespace WebApi.Controllers.AuthController;

[ApiController]
[Route("api/v{version:apiVersion}/auth")]
[ApiVersion("1.0")]
public class AuthController(IAuthService authService, IUserService userService) : NeedAuthController(userService)
{
    [HttpPost("register")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult> Register(UserCreateDto request)
    {
        await authService.RegisterAsync(request);
        return Ok();
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
        return Ok(result.GetSecuredDto());
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