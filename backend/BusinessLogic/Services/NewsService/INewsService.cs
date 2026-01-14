using DataAccess.Models;
using Shared.DataTransferObjects.Request.NewsDto;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.NewsService;

public interface INewsService: 
    ICrudService<News, NewsLinkedDto, NewsCreateDto, NewsUpdateDto>,
    IManyService<News, NewsLinkedDto, NewsSearchDto>
{
    
}