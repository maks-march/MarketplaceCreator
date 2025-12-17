using BusinessLogic.Services.NewsService;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/news")]
[ApiVersion("1.0")]
public class ManyNewsController(INewsService newsService) : 
    BaseManyController<News, NewsLinkedDto, NewsSearchDto>(newsService)
{ }