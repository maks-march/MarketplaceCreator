using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.DataTransferObjects;

namespace DataAccess.Repositories;

public class BrandRepository(AppContext context) : IBrandRepository
{
    public async Task CreateAsync(Brand brand, CancellationToken cancellationToken = default)
    {
        await context.Brands.AddAsync(brand, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Brand?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Brands.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task DeleteByIdAsync(Brand brand, CancellationToken cancellationToken = default)
    {
        context.Brands.Remove(brand);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<Brand>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Brands.ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Brand brand, BrandUpdateDto brandUpdateDto, CancellationToken cancellationToken)
    {
        brand.Update(brandUpdateDto);
        context.Brands.Update(brand);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(string name, CancellationToken cancellationToken = default)
    {
        return await context.Brands.AnyAsync(x => x.Name == name, cancellationToken);
    }
}