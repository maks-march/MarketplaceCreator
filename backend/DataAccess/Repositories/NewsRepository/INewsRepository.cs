using DataAccess.Models;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories.NewsRepository;

public interface INewsRepository : ICrudRepository<News, NewsUpdateDto>
{
}