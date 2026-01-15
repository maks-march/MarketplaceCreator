using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.CrudRepository;

public abstract class CrudRepository<T, TDto, TCreateDto, TUpdateDto>(AppContext context) : ICrudRepository<T, TUpdateDto> 
    where T : BaseModel, IBaseModel<T, TDto, TCreateDto, TUpdateDto>
{
    protected virtual DbSet<T> Items => null;
    
    public virtual async Task CreateAsync(T item, CancellationToken cancellationToken)
    {
        await Items.AddAsync(item, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Items
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public virtual async Task UpdateAsync(T item, TUpdateDto itemUpdateDto, CancellationToken cancellationToken)
    {
        item.Update(itemUpdateDto);
        Items.Update(item);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task DeleteAsync(T item, CancellationToken cancellationToken)
    {
        Items.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await Items
            .ToListAsync(cancellationToken);
    }
}