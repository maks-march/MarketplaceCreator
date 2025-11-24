using BusinessLogic.Services;
using DataAccess.Models;

namespace WebApi.Controllers;

public class NeedAuthController(IUserService userService) : BaseController
{
    protected async Task<User> GetCurrentUser()
    {
        return await userService.GetByIdAsync(GetCurrentUserId());
    }
}