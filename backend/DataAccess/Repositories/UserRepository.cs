using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository(AppContext context) : IUserRepository
{
    public async Task<User?> GetFirstOrNullByName(string name, CancellationToken cancellationToken = default)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.Username == name, cancellationToken);
    }

    public async Task<User> CreateAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = new User
        {
            Username = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Users.ToListAsync(cancellationToken);
    }
}