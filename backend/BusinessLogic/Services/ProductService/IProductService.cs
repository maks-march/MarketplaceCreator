using DataAccess;
using DataAccess.Models;
using Shared.DataTransferObjects;

namespace BusinessLogic.Services;

public interface IProductService
{
    Task CreateAsync(ProductCreateDto product, CancellationToken cancellationToken = default);
    Task<Product> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(int id, ProductUpdateDto product, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetFilteredAsync(ProductSearchDto searchDto, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> FindWithBrandsAsync(ProductSearchDto searchDto, IEnumerable<int> brands, CancellationToken cancellationToken = default);
}