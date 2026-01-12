using System.Security.Authentication;
using BusinessLogic.Services.UserService;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.UserDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllerrs;

namespace WebApi.Controllers.UsersController;

[ApiController]
[Route("api/v{version:apiVersion}/users")]
[ApiVersion("1.0")]
public class UserController(IUserService userService): 
    BaseCrudController<User, UserLinkedDto, UserCreateDto, UserUpdateDto>(userService, userService)
{
    [Authorize]
    [HttpDelete("{id:int}")]
    [MapToApiVersion("1.0")]
    public override async Task<IActionResult> DeleteAsync([FromRoute]int id)
    {
        this.EnsureValidateId(id);
        if (id != GetCurrentUserId())
            throw new AuthenticationException("Пользователь может редактировать только себя");
        await userService.DeleteByIdAsync(id, id);
        return Ok();
    }

    [Authorize]
    [HttpPatch("{id:int}")]
    [MapToApiVersion("1.0")]
    public override Task<IActionResult> UpdateAsync([FromRoute]int id, UserUpdateDto updateDto)
    {
        if (id != GetCurrentUserId())
            throw new AuthenticationException("Пользователь может редактировать только себя");
        return base.UpdateAsync(id, updateDto);
    }

    [Authorize]
    [HttpPost]
    [MapToApiVersion("1.0")]
    public override Task<IActionResult> CreateAsync(UserCreateDto createDto)
    {
        throw new NotImplementedException("Создавать пользователя может только admin");
    }
}