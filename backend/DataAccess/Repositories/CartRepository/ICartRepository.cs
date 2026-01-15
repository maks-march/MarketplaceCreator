using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;

namespace DataAccess.Repositories.CartRepository;

public interface ICartRepository : ICrudRepository<Cart, CartUpdateDto>
{
}