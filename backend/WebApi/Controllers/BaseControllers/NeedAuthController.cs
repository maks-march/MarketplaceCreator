using BusinessLogic.Services.UserService;
using DataAccess.Models;

namespace WebApi.Controllers.BaseControllerrs;

public class NeedAuthController(IUserService userService) : BaseController
{
    protected async Task<User> GetCurrentUser()
    {
        return await userService.GetByIdModelAsync(GetCurrentUserId());
    }
}