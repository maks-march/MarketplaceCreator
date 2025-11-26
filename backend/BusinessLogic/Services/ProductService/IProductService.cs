using DataAccess;
using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IProductService
{
    Task CreateAsync(ProductCreateDto product, CancellationToken cancellationToken = default);
    Task<ProductLinkedDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(int id, ProductUpdateDto product, int userId, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductLinkedDto>> GetFilteredAsync(ProductSearchDto searchDto, Func<Product, bool>? filter = null, CancellationToken cancellationToken = default);
}