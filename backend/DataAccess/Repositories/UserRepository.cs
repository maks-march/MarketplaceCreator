using DataAccess.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public class UserRepository(AppContext context) : IUserRepository
{
    public async Task<User?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.Username == name, cancellationToken);
    }

    public async Task<User?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<User> CreateAsync(UserCreateDTO request, CancellationToken cancellationToken = default)
    {
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Name = request.Name,
            Surname = request.Surname,
            Patronymic = request.Patronymic,
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