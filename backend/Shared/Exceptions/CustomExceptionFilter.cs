using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Shared.Exceptions;

public class CustomExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var result = context.Exception switch
        {
            ArgumentException => new BadRequestObjectResult(context.Exception.Message),
            InvalidOperationException => new ConflictObjectResult(context.Exception.Message),
            AuthenticationException => new UnauthorizedObjectResult(context.Exception.Message),
            NotFoundException => new NotFoundObjectResult(context.Exception.Message),
            _ => new ObjectResult("Internal server error " + ". " + context.Exception.Message + ". " + context.Exception.InnerException.Message) { StatusCode = 500 }
        };

        context.Result = result;
        context.ExceptionHandled = true;
    }
}