using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public interface IUserRepository
{
    Task<User?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default);
    Task<User?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default);
    Task<User> CreateAsync(UserCreateDTO request, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
}