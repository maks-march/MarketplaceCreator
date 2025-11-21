using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity.Data;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]/")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Register(UserCreateDTO request)
    {
        var result = await authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var result = await authService.LoginAsync(request);
        return Ok(result);
    }
}