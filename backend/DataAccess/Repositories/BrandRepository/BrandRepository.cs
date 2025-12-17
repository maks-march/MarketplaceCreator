using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace DataAccess.Repositories;

public class BrandRepository(AppContext context) : 
    CrudRepository<Brand, BrandLinkedDto, BrandCreateDto, BrandUpdateDto>(context),
    IBrandRepository
{
    protected override DbSet<Brand> Items => context.Brands;

    public override async Task<Brand?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Items
            .Include(b => b.Users)
            .Include(b => b.Products)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Brand>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await Items
            .Include(b => b.Products)
            .Include(b => b.Users)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(string name, CancellationToken cancellationToken)
    {
        return await Items.AnyAsync(x => x.Name == name, cancellationToken);
    }
}