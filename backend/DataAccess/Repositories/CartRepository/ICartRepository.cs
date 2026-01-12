using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Shared.DataTransferObjects.Request.CartDto;

namespace WebApi.Controllers.CartsController;

public interface ICartRepository : ICrudRepository<Cart, CartUpdateDto>
{
}