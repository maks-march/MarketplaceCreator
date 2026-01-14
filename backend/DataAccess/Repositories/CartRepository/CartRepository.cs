using DataAccess.Models;
using DataAccess.Repositories.CrudRepository;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects.Request.CartDto;
using Shared.DataTransferObjects.Response.CartDto;
using WebApi.Controllers.CartsController;

namespace DataAccess.Repositories.CartRepository;

public class CartRepository(AppContext context) : 
    CrudRepository<Cart, CartLinkedDto, CartCreateDto, CartUpdateDto>(context), 
    ICartRepository
{
    protected override DbSet<Cart> Items => context.Carts;

    public override async Task<Cart?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Items
            .Include(c => c.Items)
            .ThenInclude(c => c.Product)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Cart>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await Items
            .Include(c => c.Items)
            .ThenInclude(c => c.Product)
            .Include(c => c.User)
            .ToListAsync(cancellationToken);
    }
}