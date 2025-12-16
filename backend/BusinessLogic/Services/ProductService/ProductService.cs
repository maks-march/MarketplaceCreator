using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

internal class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task CreateAsync(ProductCreateDto userCreateDto, User user, CancellationToken cancellationToken = default)
    {
        var product = Product.Create(userCreateDto);
        var brand = user.Brands.FirstOrDefault(b => b.Id == userCreateDto.BrandId);
        if (brand is null)
            throw new NotFoundException($"Бренда с id {userCreateDto.BrandId} не найдено");
        product.Brand = brand;
        await productRepository.CreateAsync(product, cancellationToken);
    }

    public async Task<ProductLinkedDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken);
        return product.GetLinkedDto();
    }

    public async Task UpdateByIdAsync(int id, ProductUpdateDto userUpdateDto, User user, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken, user.Id);
        await productRepository.UpdateAsync(product, userUpdateDto, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken, userId);
        await productRepository.DeleteAsync(product, cancellationToken);
    }

    public async Task<IEnumerable<ProductLinkedDto>> GetFilteredAsync(ProductSearchDto searchDto, Func<Product, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync();
        if (!string.IsNullOrEmpty(searchDto.Query))
            products = products.Where(
                p => p.Title.Contains(searchDto.Query) || p.Description.Contains(searchDto.Query)
            );
        return products
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetLinkedDto())
            .ToList();
    }
    
    private async Task<Product> GetProductById(int id, CancellationToken cancellationToken, int userId = -1)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            throw new NotFoundException($"Product with id {id} not found");
        if (userId != -1 && product.Brand.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return product;
    }
}