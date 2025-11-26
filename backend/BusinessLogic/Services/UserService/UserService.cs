using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllAsync(UserSearchDto searchDto, CancellationToken cancellationToken = default)
    {
        var brands = await userRepository.GetAllAsync(cancellationToken);
        
        return brands
            .Select(u => u.GetDto())
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }
    
    public async Task<User> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await GetUserById(id, true, cancellationToken: cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, User user, CancellationToken cancellationToken = default)
    {
        var currentUser = await GetUserById(id, user.IsAdmin, cancellationToken: cancellationToken);
        await userRepository.DeleteAsync(currentUser, cancellationToken);
    }
    
    private async Task<User> GetUserById(int userId, bool isAdmin = false, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByIdAsync(userId, cancellationToken);
        if (user is null)
            throw new NotFoundException($"Пользователя с id {userId} не найдено");
        if (!isAdmin)
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return user;
    }
}