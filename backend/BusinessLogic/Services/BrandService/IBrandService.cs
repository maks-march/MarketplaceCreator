using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IBrandService
{
    Task CreateAsync(BrandCreateDto brandCreateDto, User user, CancellationToken cancellationToken = default);
    Task<BrandLinkedDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BrandDto>> GetAllBrands(BrandSearchDto searchDto, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(int id, BrandUpdateDto brandUpdateDto, int userId, CancellationToken cancellationToken = default);
}