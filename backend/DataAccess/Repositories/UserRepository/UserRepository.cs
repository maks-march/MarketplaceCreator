using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public class UserRepository(AppContext context) : IUserRepository
{
    public async Task CreateAsync(User user, CancellationToken cancellationToken)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user, UserUpdateDto dto, CancellationToken cancellationToken)
    {
        user.Update(dto);
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user, CancellationToken cancellationToken)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Users
            .Include(u => u.Brands)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Users
            .Include(u => u.Brands)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
    
    #region get
    public async Task<UserSecureDto?> GetSecureFirstOrNullByUsername(string name, CancellationToken cancellationToken = default)
    {
        var user = await GetUser(name);
        return CreateSecureDtoFromUser(user);
    }

    public async Task<UserSecureDto?> GetSecureFirstOrNullByEmail(string email, CancellationToken cancellationToken = default)
    {
        var user = await GetUser(email, true);
        return CreateSecureDtoFromUser(user);
    }
    
    public async Task<UserLinkedDto?> GetFirstOrNullByUsername(string name, CancellationToken cancellationToken = default)
    {
        var user = await GetUser(name);
        return CreateLinkedDtoFromUser(user);
    }

    public async Task<UserLinkedDto?> GetFirstOrNullByEmail(string email, CancellationToken cancellationToken = default)
    {
        var user = await GetUser(email, true);
        return CreateLinkedDtoFromUser(user);
    }

    private static UserSecureDto? CreateSecureDtoFromUser(User user)
    {
        if (user is not null) 
            return user.GetSecuredDto();
        return null;
    }
    
    private static UserLinkedDto? CreateLinkedDtoFromUser(User user)
    {
        if (user is not null) 
            return user.GetLinkedDto();
        return null;
    }

    private async Task<User?> GetUser(string value, bool byEmail = false, CancellationToken cancellationToken = default)
    {
        if (byEmail)
            return await GetUserByEmail(value, cancellationToken);
        else
            return await GetUserByUsername(value, cancellationToken);
    }

    private async Task<User?> GetUserByUsername(string username, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .Include(u => u.Brands)
            .FirstOrDefaultAsync(x => x.Username == username, cancellationToken);
    }
    
    private async Task<User?> GetUserByEmail(string email, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .Include(u => u.Brands)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }
    #endregion
}