using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Shared.DataTransferObjects.Request.BrandDto;

namespace DataAccess.Repositories.BrandRepository;

public interface IBrandRepository : ICrudRepository<Brand, BrandUpdateDto>
{
    Task<bool> ExistsAsync(string Name, CancellationToken cancellationToken);
}