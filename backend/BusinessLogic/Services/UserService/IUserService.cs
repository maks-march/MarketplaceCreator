using DataAccess.Models;
using Shared.DataTransferObjects.Request.UserDto;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.UserService;

public interface IUserService: 
    IManyService<User, UserLinkedDto, UserSearchDto>, 
    ICrudService<User, UserLinkedDto, UserCreateDto, UserUpdateDto>
{
    Task<User> GetEntityByIdAsync(int id, CancellationToken cancellationToken = default);
}