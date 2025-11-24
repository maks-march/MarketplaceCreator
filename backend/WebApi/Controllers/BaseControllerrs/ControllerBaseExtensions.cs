using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public static class ControllerBaseExtensions
{
    public static void EnsureValidateId(this ControllerBase controller, int id)
    {
        if (id < 1)
            throw new ArgumentException("Id cant be less than 1");
    }
}