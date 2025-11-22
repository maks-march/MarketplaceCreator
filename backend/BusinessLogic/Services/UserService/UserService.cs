using DataAccess.Models;
using DataAccess.Repositories;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await userRepository.GetAllAsync(cancellationToken);
    }
    
    public async Task<User> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var result = await userRepository.GetByIdAsync(id, cancellationToken);
        if (result == null)
            throw new NotFoundException($"Пользователья с id = {id} не найдено");
        return result;
    }
}