using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.NewsService;

public interface INewsService: 
    ICrudService<NewsLinkedDto, NewsCreateDto, NewsUpdateDto>,
    IManyService<News, NewsLinkedDto, NewsSearchDto>
{
    
}