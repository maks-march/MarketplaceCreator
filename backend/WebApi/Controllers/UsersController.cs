using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class UsersController(IUserService userService) : BaseController
{
    [HttpGet]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var searchDto = new UserSearchDto()
        {
            Page = page,
            PageSize = pageSize
        };
        var users = await userService.GetAllAsync(searchDto);
        return Ok(users);
    }
    
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
        var user = await userService.GetByIdAsync(GetCurrentUserId());
        await userService.DeleteByIdAsync(id, user);
        return Ok();
    }
}