using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

internal class ProductRepository(AppContext context) : 
    CrudRepository<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(context),
    IProductRepository
{
    protected override DbSet<Product> Items => context.Products;

    public override async Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Products
            .Include(p => p.Brand)
            .Include(p => p.Brand.Users)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Product>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Products
            .Include(p => p.Brand)
            .Include(p => p.Brand.Users)
            .ToListAsync(cancellationToken);
    }
}