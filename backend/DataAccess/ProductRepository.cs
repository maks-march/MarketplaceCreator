using Microsoft.EntityFrameworkCore;

namespace DataAccess;

internal class ProductRepository(AppContext context) : IProductRepository
{
    public async Task CreateAsync(Product product, CancellationToken cancellationToken = default)
    {
        product.Created = DateTime.UtcNow;
        await context.Products.AddAsync(product, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Products.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task UpdateByIdAsync(Product product, CancellationToken cancellationToken = default)
    {
        product.Updated = DateTime.UtcNow;
        context.Products.Update(product);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteByIdAsync(Product product, CancellationToken cancellationToken = default)
    {
        context.Products.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
    }
}