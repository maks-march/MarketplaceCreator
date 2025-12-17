using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IUserService: 
    IManyService<User, UserLinkedDto, UserSearchDto>, 
    ICrudService<UserLinkedDto, UserCreateDto, UserUpdateDto>
{
    Task<User> GetEntityByIdAsync(int id, CancellationToken cancellationToken = default);
}