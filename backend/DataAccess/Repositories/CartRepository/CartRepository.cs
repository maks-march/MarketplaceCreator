using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response.CartDto;
using WebApi.Controllers.CartsController;

namespace DataAccess.Repositories.CartRepository;

public class CartRepository(AppContext context) : 
    CrudRepository<Cart, CartLinkedDto, CartCreateDto, CartUpdateDto>(context), 
    ICartRepository
{
}