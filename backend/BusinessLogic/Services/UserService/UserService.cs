using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class UserService(IUserRepository userRepository) : 
    CrudService<User, UserLinkedDto, UserCreateDto, UserUpdateDto>(userRepository),
    IUserService
{
    protected async override Task<bool> CheckItem(User? item, int userId = -1, params string[] valuesCheck)
    {
        await base.CheckItem(item, userId, valuesCheck);
        if (item is null)
            throw new NotFoundException($"Пользователя с id {userId} не найдено");
        if (userId != -1 && (!item.IsAdmin || userId == item.Id))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await Task.FromResult(true);
    }

    protected async override Task<User> FillFromUser(User item, User user, CancellationToken cancellationToken)
    {
        if (!user.IsAdmin)
        {
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        }
        return await base.FillFromUser(item, user, cancellationToken);
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
            .Select(p => p.GetDto())
            .ToList();
    }

    public async Task<User> GetEntityByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetByIdAsync(id, cancellationToken);
        if (user is null)
            throw new NotFoundException("Пользователь не найден");
        return user;
    }
}