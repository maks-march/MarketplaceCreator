using DataAccess.Models;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public interface IBrandRepository
{
    Task CreateAsync(Brand brand, CancellationToken cancellationToken = default);
    Task<Brand?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(Brand brand, CancellationToken cancellationToken = default);
    Task<IEnumerable<Brand>> GetAllAsync(CancellationToken cancellationToken = default);
    Task UpdateAsync(Brand brand, BrandUpdateDto productDto, CancellationToken cancellationToken);
    
    Task<bool> ExistsAsync(string Name, CancellationToken cancellationToken = default);
}