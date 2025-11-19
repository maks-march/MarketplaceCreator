using Shared.DataTransferObjects;

namespace DataAccess;

public interface IProductRepository
{
    Task CreateAsync(Product product, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(Product product, ProductUpdateDTO productDto, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(Product product, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetAllAsync(CancellationToken cancellationToken = default);
}