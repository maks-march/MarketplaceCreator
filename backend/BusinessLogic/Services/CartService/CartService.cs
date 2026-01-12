using System.Security.Authentication;
using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response.CartDto;
using Shared.Exceptions;

namespace WebApi.Controllers.CartsController;

public class CartService(ICartRepository cartRepository) : ICartService
{
    public async Task UpdateAsync(int id, CartUpdateDto cartUpdateDto, int userId, CancellationToken cancellationToken = default)
    {
        var cart = await cartRepository.GetByIdAsync(id, cancellationToken);
        if (cart is null)
            throw new NotFoundException("Данный ресурс не найден");
        if (userId != cart.UserId)
            throw new AuthenticationException("Данный пользователь не может редактировать этот ресурс");
        cart.Update(cartUpdateDto);
    }

    public async Task<CartDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var cart = await cartRepository.GetByIdAsync(id, cancellationToken);
        if (cart is null)
            throw new NotFoundException("Данный ресурс не найден");
        return cart.GetUnlinkedDto();
    }
}