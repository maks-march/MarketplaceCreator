using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public interface IUserRepository : ICrudRepository<User, UserUpdateDto>
{
    Task<UserSecureDto?> GetSecureFirstOrNullByUsername(string name, CancellationToken cancellationToken);
    Task<UserSecureDto?> GetSecureFirstOrNullByEmail(string email, CancellationToken cancellationToken);
    Task<UserLinkedDto?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken);
    Task<UserLinkedDto?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken);
}