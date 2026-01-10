using BusinessLogic.Services;
using BusinessLogic.Services.NewsService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/news")]
[ApiVersion("1.0")]
public class NewsController(INewsService newsService, IUserService userService) :
    BaseCrudController<NewsLinkedDto, NewsCreateDto, NewsUpdateDto>(newsService, userService)
{
    [Authorize]
    [MapToApiVersion("1.0")]
    [Consumes("multipart/form-data")]
    public override async Task<IActionResult> CreateAsync([FromForm]NewsCreateDto createDto)
    {
        var user = await GetCurrentUser();
        await newsService.CreateAsync(createDto, user);
        return NoContent();
    }
}