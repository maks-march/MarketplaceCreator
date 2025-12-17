using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class BrandService(IBrandRepository brandRepository) : 
    CrudService<Brand, BrandLinkedDto, BrandCreateDto, BrandUpdateDto>(brandRepository),
    IBrandService
{
    protected async override Task<bool> CheckItem(Brand? item, int userId = -1, params string[] valuesCheck)
    {
        await base.CheckItem(item, userId, valuesCheck);
        if (userId != -1 && item!.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await Task.FromResult(true);
    }

    protected async override Task<Brand> FillFromUser(Brand item, User user, CancellationToken cancellationToken)
    {
        if (await brandRepository.ExistsAsync(item.Name, cancellationToken))
            throw new InvalidOperationException("Такой бренд уже существует");
        item.Users.Add(user);
        return await base.FillFromUser(item, user, cancellationToken);
    }

    public async Task<IEnumerable<BrandLinkedDto>> GetFilteredAsync(BrandSearchDto searchDto, Func<Brand, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        var brands = await brandRepository.GetAllAsync(cancellationToken);
        if (!string.IsNullOrEmpty(searchDto.Query))
            brands = brands.Where(
                p => p.Name.Contains(searchDto.Query)
            );
        return brands
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetDto())
            .ToList();
    }
}