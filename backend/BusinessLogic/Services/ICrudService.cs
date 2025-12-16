using DataAccess.Models;

namespace BusinessLogic.Services;

public interface ICrudService<TDto, TCreateDto, TUpdateDto>
{
    Task<TDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    
    Task CreateAsync(TCreateDto userCreateDto, User user, CancellationToken cancellationToken = default);
    
    Task UpdateByIdAsync(int id, TUpdateDto userUpdateDto, User user, CancellationToken cancellationToken = default);
    
    Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default);
}