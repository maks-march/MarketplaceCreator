using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public interface ICrudRepository<T, TUpdateDto>
{
    Task CreateAsync(T item, CancellationToken cancellationToken);
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task UpdateAsync(T item, TUpdateDto updateDto, CancellationToken cancellationToken);
    Task DeleteAsync(T item, CancellationToken cancellationToken);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken);
}