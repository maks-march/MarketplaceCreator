using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public class UserRepository(AppContext context) : IUserRepository
{
    public async Task CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user, CancellationToken cancellationToken = default)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserLinkedDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Users
            .Select(u => u.GetLinkedDtoFromUser())
            .ToListAsync(cancellationToken);
    }
    
    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Users
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
    
    #region get
    public async Task<UserSecureDto?> GetSecureFirstOrNullByUsername(string name, CancellationToken cancellationToken = default)
    {
        return await GetUserDto(name, false, true, cancellationToken) as UserSecureDto;
    }

    public async Task<UserSecureDto?> GetSecureFirstOrNullByEmail(string email, CancellationToken cancellationToken = default)
    {
        return await GetUserDto(email, true, true, cancellationToken) as UserSecureDto;
    }
    
    public async Task<UserLinkedDto?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default)
    {
        return await GetUserDto(name, false, false, cancellationToken) as UserLinkedDto;
    }

    public async Task<UserLinkedDto?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default)
    {
        return await GetUserDto(email, true, false, cancellationToken) as UserLinkedDto;
    }

    private async Task<UserDto?> GetUserDto(string value, bool byEmail = false, bool isSecure = false, CancellationToken cancellationToken = default)
    {
        var user = await GetUser(value, byEmail);
        if (user is not null) 
            return CreateDtoFromUser(isSecure, user);
        return null;
    }

    private static UserDto? CreateDtoFromUser(bool isSecure, User user)
    {
        if (isSecure)
            return user.GetSecuredDtoFromUser();
        else
            return user.GetLinkedDtoFromUser();
    }

    private async Task<User?> GetUser(string value, bool byEmail, CancellationToken cancellationToken = default)
    {
        if (byEmail)
            return await GetUserByEmail(value, cancellationToken);
        else
            return await GetUserByUsername(value, cancellationToken);
    }

    private async Task<User?> GetUserByUsername(string username, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .FirstOrDefaultAsync(x => x.Username == username, cancellationToken);
    }
    
    private async Task<User?> GetUserByEmail(string email, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }
    #endregion
}