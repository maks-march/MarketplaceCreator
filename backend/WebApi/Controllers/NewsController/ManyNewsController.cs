using BusinessLogic.Services.NewsService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects.Request.NewsDto;
using Shared.DataTransferObjects.Response;
using WebApi.Controllers.BaseControllers;

namespace WebApi.Controllers.NewsController;

[ApiController]
[Route("api/v{version:apiVersion}/news")]
[ApiVersion("1.0")]
public class ManyNewsController(INewsService newsService) : 
    BaseManyController<News, NewsLinkedDto, NewsSearchDto>(newsService)
{ }