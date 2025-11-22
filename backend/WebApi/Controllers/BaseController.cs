using System.Security.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public abstract class BaseController : ControllerBase
{
    protected int GetCurrentUserId()
    {
        if (User.Identity?.IsAuthenticated == null || !User.Identity.IsAuthenticated)
            throw new AuthenticationException("Вы не авторизованы");
        return int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );
    }
}