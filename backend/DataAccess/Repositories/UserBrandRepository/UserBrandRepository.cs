using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Shared.Exceptions;

namespace DataAccess.Repositories.UserBrandRepository;

public class UserBrandRepository(AppContext context) : IUserBrandRepository
{
    public async Task SubscribeToBrandAsync(User user, Brand brand, CancellationToken cancellationToken = default)
    {
        var existing = await context.UserBrand
            .FirstOrDefaultAsync(ub => ub.UserId == user.Id && ub.BrandId == brand.Id, cancellationToken);

        if (existing != null)
        {
            throw new InvalidOperationException("Пользователь уже имеет этот брэнд.");
        }

        var userBrand = UserBrand.Create(user, brand);

        await context.UserBrand.AddAsync(userBrand);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UnsubscribeFromBrandAsync(User user, Brand brand, CancellationToken cancellationToken = default)
    {
        var userBrand =  await context.UserBrand
            .FirstOrDefaultAsync(ub => ub.UserId == user.Id && ub.BrandId == brand.Id, cancellationToken);

        if (userBrand == null)
            throw new NotFoundException("Пользователь не владелец брэнда");

        context.UserBrand.Remove(userBrand);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<Brand>> GetBrandsOfUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        var brands = await context.UserBrand
            .Where(ub => ub.UserId == userId)
            .Select(ub => ub.Brand)
            .ToListAsync(cancellationToken);
        if (brands.Count == 0)
            throw new NotFoundException("У пользователя нету брэндов");
        return brands;
    }

    public async Task<IEnumerable<User>> GetUsersOfBrandAsync(int brandId, CancellationToken cancellationToken = default)
    {
        var users = await context.UserBrand
            .Where(ub => ub.BrandId == brandId)
            .Select(ub => ub.User)
            .ToListAsync(cancellationToken);
        if (users.Count == 0)
            throw new NotFoundException("У брэнда нету пользователей");
        return users;
    }
}