using DataAccess;
using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.Exceptions;

namespace BusinessLogic.Services;

internal class ProductService(IProductRepository productRepository, IBrandRepository brandRepository) : IProductService
{
    public async Task CreateAsync(ProductCreateDTO productDto, int userId, CancellationToken cancellationToken = default)
    {
        var product = ProductExtensions.Create(productDto);
        var brand = 
        
        product.BrandId = userId;
        await productRepository.CreateAsync(product, cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        return product;
    }

    public async Task UpdateByIdAsync(int id, ProductUpdateDTO productDto, int userId, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            throw new NotFoundException("No product found");
        
        await productRepository.UpdateByIdAsync(product, productDto, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        await productRepository.DeleteByIdAsync(product, cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetAllAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        
        return products.Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }

    public async Task<IEnumerable<Product>> FindAsync(ProductSearchDTO searchDto, CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        
        if (!string.IsNullOrEmpty(searchDto.Query))
            products = products.Where(
                p => p.Title.Contains(searchDto.Query) || p.Description.Contains(searchDto.Query)
                );
        
        return products.Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }
}