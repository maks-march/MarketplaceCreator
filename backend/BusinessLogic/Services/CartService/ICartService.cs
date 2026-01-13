using BusinessLogic.Services;
using DataAccess.Models;
using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response.CartDto;

namespace WebApi.Controllers.CartsController;

public interface ICartService
{
    public Task UpdateAsync(int id, CartUpdateDto cartUpdateDto, int userId, CancellationToken cancellationToken = default);
    
    Task<CartDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
}