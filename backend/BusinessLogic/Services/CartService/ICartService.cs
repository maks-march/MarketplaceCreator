using DataAccess.Models;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.CartService;

public interface ICartService
{
    public Task UpdateAsync(int id, CartUpdateDto cartUpdateDto, int userId, CancellationToken cancellationToken = default);
    
    Task<CartDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<CartDto> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
}