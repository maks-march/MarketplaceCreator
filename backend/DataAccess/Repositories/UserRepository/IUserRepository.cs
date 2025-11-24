using DataAccess.Models;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public interface IUserRepository
{
    Task<UserSecureDto?> GetSecureFirstOrNullByUsername(string name, CancellationToken cancellationToken = default);
    Task<UserSecureDto?> GetSecureFirstOrNullByEmail(string email, CancellationToken cancellationToken = default);
    Task<UserLinkedDto?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default);
    Task<UserLinkedDto?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<UserLinkedDto>> GetAllAsync(CancellationToken cancellationToken = default);
    
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
    
    Task CreateAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteAsync(User user, CancellationToken cancellationToken = default);
}