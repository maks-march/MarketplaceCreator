using BusinessLogic.Services.UserService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.UserDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllers;

namespace WebApi.Controllers.UsersController;

[ApiController]
[Route("api/v{version:apiVersion}/users")]
[ApiVersion("1.0")]
public class UsersController(IUserService userService): 
    BaseManyController<User, UserLinkedDto, UserSearchDto>(userService)
{
}