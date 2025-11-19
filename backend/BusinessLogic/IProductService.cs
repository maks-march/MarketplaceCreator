using DataAccess;
using Shared.DataTransferObjects;

namespace BusinessLogic;

public interface IProductService
{
    Task CreateAsync(string title, string description = "", CancellationToken cancellationToken = default);
    Task<string> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateByIdAsync(int id, string title, CancellationToken cancellationToken = default);
    Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetAllAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> FindAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default);
}