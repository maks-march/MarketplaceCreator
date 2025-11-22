using System.Security.Authentication;
using System.Security.Claims;
using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAllAsync()
    {
        var users = await userService.GetAllAsync();
        return Ok(users);
    }
}