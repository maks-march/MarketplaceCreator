using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity.Data;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]/")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Register(LoginRequest request)
    {
        try
        {
            var result = await authService.RegisterAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    [MapToApiVersion("1.0")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            var result = await authService.LoginAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}