using DataAccess.Models;

namespace BusinessLogic.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
    
    Task<User> GetByIdAsync(int id, CancellationToken cancellationToken = default);
}