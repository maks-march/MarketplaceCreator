using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Shared.DataTransferObjects.Response;

namespace Shared.Exceptions;

public class CustomExceptionFilter : IExceptionFilter
{
    public ErrorsDto FillErrorsDto(string error, ErrorsDto? actual = null)
    {
        var dto = new ErrorsDto();
        if (actual != null)
        {
            dto.Errors = actual.Errors;
        }

        if (!dto.Errors.TryAdd("", new[] { error }))
        {
            dto.Errors[""].Append(error);
        }
        return dto;
    }
    public void OnException(ExceptionContext context)
    {
        var result = context.Exception switch
        {
            ArgumentException => new BadRequestObjectResult(FillErrorsDto(context.Exception.Message)),
            InvalidOperationException => new ConflictObjectResult(FillErrorsDto(context.Exception.Message)),
            AuthenticationException => new UnauthorizedObjectResult(FillErrorsDto(context.Exception.Message)),
            NotFoundException => new NotFoundObjectResult(FillErrorsDto(context.Exception.Message)),
            _ => new ObjectResult(FillErrorsDto("Internal server error " + ". " + context.Exception.Message + ". " + context.Exception.InnerException.Message)) { StatusCode = 500 }
        };

        context.Result = result;
        context.ExceptionHandled = true;
    }
}

