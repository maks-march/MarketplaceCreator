using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync(UserSearchDto searchDto, CancellationToken cancellationToken = default);
    
    Task<User> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task DeleteByIdAsync(int id, User user, CancellationToken cancellationToken = default);
}