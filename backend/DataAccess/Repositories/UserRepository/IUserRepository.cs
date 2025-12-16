using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public interface IUserRepository
{
    Task<UserSecureDto?> GetSecureFirstOrNullByUsername(string name, CancellationToken cancellationToken);
    Task<UserSecureDto?> GetSecureFirstOrNullByEmail(string email, CancellationToken cancellationToken);
    Task<UserLinkedDto?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken);
    Task<UserLinkedDto?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken);
    
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken);
    
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
    
    Task CreateAsync(User user, CancellationToken cancellationToken);
    Task UpdateAsync(User user, UserUpdateDto dto, CancellationToken cancellationToken);
    Task DeleteAsync(User user, CancellationToken cancellationToken);
}