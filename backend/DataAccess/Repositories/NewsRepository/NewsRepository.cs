using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories.NewsRepository;

public class NewsRepository(AppContext context) : 
    CrudRepository<News, NewsLinkedDto, NewsCreateDto, NewsUpdateDto>(context),
    INewsRepository
{
    protected override DbSet<News> Items => context.News;

    public override async Task<News?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Items
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<News>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.News
            .Include(p => p.Brand)
            .ToListAsync(cancellationToken);
    }
}