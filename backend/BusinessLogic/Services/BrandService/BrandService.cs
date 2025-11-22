using DataAccess.Models;
using DataAccess.Repositories;
using DataAccess.Repositories.UserBrandRepository;
using Shared.DataTransferObjects;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class BrandService(IBrandRepository brandRepository, IUserBrandRepository userBrandRepository) : IBrandService
{
    public async Task CreateAsync(BrandCreateDto brandCreateDto, User user, CancellationToken cancellationToken = default)
    {
        var brand = Brand.Create(brandCreateDto);
        if (await brandRepository.ExistsAsync(brand.Name, cancellationToken))
            throw new InvalidOperationException("Такой бренд уже существует");
        await brandRepository.CreateAsync(brand, cancellationToken);
        await userBrandRepository.SubscribeToBrandAsync(user, brand, cancellationToken);
    }

    public async Task<Brand> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var brand = await brandRepository.GetByIdAsync(id, cancellationToken);
        if (brand is null)
            throw new NotFoundException($"Бренда с id {id} не найдено");
        return brand;
    }

    public async Task DeleteByIdAsync(int id, int user, CancellationToken cancellationToken = default)
    {
        var brand = await GetByIdAsync(id,cancellationToken);
        await brandRepository.DeleteByIdAsync(brand, cancellationToken);
    }

    public async Task<IEnumerable<Brand>> GetAllBrands(BrandSearchDto searchDto, CancellationToken cancellationToken = default)
    {
        var brands = await brandRepository.GetAllAsync(cancellationToken);
        
        return brands.Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }

    public async Task UpdateByIdAsync(int id, BrandUpdateDto brandUpdateDto, int user, CancellationToken cancellationToken)
    {
        var brand = await GetByIdAsync(id, cancellationToken);
        await brandRepository.UpdateAsync(brand, brandUpdateDto, cancellationToken);
    }
}