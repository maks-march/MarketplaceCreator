using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

public class BrandService(IBrandRepository brandRepository) : IBrandService
{
    public async Task CreateAsync(BrandCreateDto brandCreateDto, User user, CancellationToken cancellationToken = default)
    {
        if (await brandRepository.ExistsAsync(brandCreateDto.Name, cancellationToken))
            throw new InvalidOperationException("Такой бренд уже существует");
        
        var brand = Brand.Create(brandCreateDto);
        brand.Users.Add(user);
        await brandRepository.CreateAsync(brand, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var brand = await GetBrandById(id, cancellationToken: cancellationToken);
        await brandRepository.DeleteByIdAsync(brand, cancellationToken);
    }

    public async Task<IEnumerable<BrandDto>> GetAllBrands(BrandSearchDto searchDto, CancellationToken cancellationToken = default)
    {
        var brands = await brandRepository.GetAllAsync(cancellationToken);
        
        return brands.Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }

    public async Task UpdateByIdAsync(int id, BrandUpdateDto brandUpdateDto, int userId, CancellationToken cancellationToken)
    {
        var brand = await GetBrandById(id, userId, cancellationToken: cancellationToken);
        await brandRepository.UpdateAsync(brand, brandUpdateDto, cancellationToken);
    }
    
    public async Task<BrandDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var brand = await GetBrandById(id, cancellationToken: cancellationToken);
        return brand.GetDtoFromBrand();
    }


    private async Task<Brand> GetBrandById(int brandId, int userId = -1, CancellationToken cancellationToken = default)
    {
        var brand = await brandRepository.GetByIdAsync(brandId, cancellationToken);
        if (brand is null)
            throw new NotFoundException($"Бренда с id {brandId} не найдено");
        if (userId != -1 && brand.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        
        return brand;
    }
}