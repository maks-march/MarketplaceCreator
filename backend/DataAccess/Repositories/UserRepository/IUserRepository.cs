using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public interface IUserRepository
{
    Task<User?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default);
    Task<User?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default);
    Task CreateAsync(User user, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
}