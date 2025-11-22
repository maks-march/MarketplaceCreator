using DataAccess.Models;

namespace DataAccess.Repositories.UserBrandRepository;

public interface IUserBrandRepository
{
    Task SubscribeToBrandAsync(User user, Brand brand, CancellationToken cancellationToken = default);
    Task UnsubscribeFromBrandAsync(User user, Brand brand, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<Brand>> GetBrandsOfUserAsync(int userId, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<User>> GetUsersOfBrandAsync(int brandId, CancellationToken cancellationToken = default);
}