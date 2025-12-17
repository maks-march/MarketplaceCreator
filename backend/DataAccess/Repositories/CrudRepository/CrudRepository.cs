using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public class CrudRepository<T, TDto, TCreateDto, TUpdateDto>(AppContext context) : ICrudRepository<T, TUpdateDto> 
    where T : BaseModel, IBaseModel<T, TDto, TCreateDto, TUpdateDto>
{
    protected virtual DbSet<T> Items => null;
    
    public virtual async Task CreateAsync(T product, CancellationToken cancellationToken)
    {
        await Items.AddAsync(product, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Items
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public virtual async Task UpdateAsync(T product, TUpdateDto productDto, CancellationToken cancellationToken)
    {
        product.Update(productDto);
        Items.Update(product);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task DeleteAsync(T product, CancellationToken cancellationToken)
    {
        Items.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await Items
            .ToListAsync(cancellationToken);
    }
}