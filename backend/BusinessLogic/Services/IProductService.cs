using DataAccess;
using DataAccess.Models;
using Shared.DataTransferObjects;

namespace BusinessLogic.Services;

public interface IProductService
{
    Task CreateAsync(ProductCreateDTO product, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(int id, ProductUpdateDTO product, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetAllAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> FindAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default);
}