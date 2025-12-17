using BusinessLogic.Services;
using BusinessLogic.Services.NewsService;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/news")]
[ApiVersion("1.0")]
public class NewsController(INewsService newsService, IUserService userService) : 
    BaseCrudController<NewsLinkedDto, NewsCreateDto, NewsUpdateDto>(newsService, userService)
{ }