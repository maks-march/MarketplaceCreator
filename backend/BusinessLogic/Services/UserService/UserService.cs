using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<IEnumerable<UserLinkedDto>> GetAllAsync(UserSearchDto searchDto, CancellationToken cancellationToken = default)
    {
        var users = await userRepository.GetAllAsync(cancellationToken);

        return users
            .Select(u => u.GetLinkedDto())
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize);
    }
    
    public async Task<User> GetEntityByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await GetUserById(id, true, cancellationToken: cancellationToken);
    }

    public async Task CreateAsync(UserCreateDto userCreateDto, User user, CancellationToken cancellationToken = default)
    {
        if (!user.IsAdmin)
        {
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        }
        await userRepository.CreateAsync(User.Create(userCreateDto), cancellationToken);
    }

    public async Task UpdateByIdAsync(int id, UserUpdateDto userUpdateDto, User redactor, CancellationToken cancellationToken = default)
    {
        var user = await GetUserById(id, redactor.IsAdmin || redactor.Id == id, cancellationToken);
        await userRepository.UpdateAsync(user, userUpdateDto, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var redactor = await GetUserById(userId, true, cancellationToken);
        if (!redactor.IsAdmin)
        {
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        }
        await userRepository.DeleteAsync(await GetUserById(id, redactor.IsAdmin, cancellationToken), cancellationToken);
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

    public async Task<IEnumerable<UserLinkedDto>> GetFilteredAsync(UserSearchDto searchDto, Func<User, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        var users = await userRepository.GetAllAsync(cancellationToken);
        if (!string.IsNullOrEmpty(searchDto.Query))
            users = users.Where(
                p => p.Name.Contains(searchDto.Query) 
                     || p.Surname.Contains(searchDto.Query) 
                     || (p.Name + p.Surname).Contains(searchDto.Query)
            );
        return users
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetLinkedDto())
            .ToList();
    }

    public async Task<UserLinkedDto> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var user = await GetUserById(id);
        return user.GetLinkedDto();
    }
}