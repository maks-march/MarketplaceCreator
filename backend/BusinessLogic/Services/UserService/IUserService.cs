using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IUserService: 
    IManyService<User, UserLinkedDto, UserSearchDto>, 
    ICrudService<UserLinkedDto, UserCreateDto, UserUpdateDto>
{
    Task<IEnumerable<UserLinkedDto>> GetAllAsync(UserSearchDto searchDto, CancellationToken cancellationToken = default);
    
    Task<User> GetEntityByIdAsync(int id, CancellationToken cancellationToken = default);

    Task DeleteByIdAsync(int id, User user, CancellationToken cancellationToken = default);
}