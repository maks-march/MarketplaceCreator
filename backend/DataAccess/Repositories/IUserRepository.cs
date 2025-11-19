using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;

namespace DataAccess.Repositories;

public interface IUserRepository
{
    Task<User?> GetFirstOrNullByName(string name, CancellationToken cancellationToken = default);
    Task<User> CreateAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
}