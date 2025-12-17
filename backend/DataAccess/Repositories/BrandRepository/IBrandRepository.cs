using DataAccess.Models;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public interface IBrandRepository : ICrudRepository<Brand, BrandUpdateDto>
{
    Task<bool> ExistsAsync(string Name, CancellationToken cancellationToken);
}