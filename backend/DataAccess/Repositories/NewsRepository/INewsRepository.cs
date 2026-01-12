using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Request.NewsDto;

namespace DataAccess.Repositories.NewsRepository;

public interface INewsRepository : ICrudRepository<News, NewsUpdateDto>
{
}