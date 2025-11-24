using DataAccess.Models;
using DataAccess.Repositories;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

internal class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task CreateAsync(ProductCreateDto productDto, CancellationToken cancellationToken = default)
    {
        var product = Product.Create(productDto);
        await productRepository.CreateAsync(product, cancellationToken);
    }

    public async Task<ProductLinkedDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken);
        return product.GetLinkedDtoFromProduct();
    }

    public async Task UpdateByIdAsync(int id, ProductUpdateDto productDto, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken);
        await productRepository.UpdateAsync(product, productDto, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await GetProductById(id, cancellationToken);
        await productRepository.DeleteAsync(product, cancellationToken);
    }

    public async Task<IEnumerable<ProductLinkedDto>> GetFilteredAsync(ProductSearchDto searchDto, Func<Product, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        if (filter is null)
            return await FilterProducts(searchDto, null);
        
        var dtoFilter = (ProductDto p) =>
        {
            var product = new Product
            {
                Id = p.Id,
                Created = p.Created,
                Updated = p.Updated,
                BrandId = p.BrandId,
                Title = p.Title,
                Description = p.Description
            };
            return filter(product);
        };
        var products = await FilterProducts(searchDto, dtoFilter);
        return products;
    }

    public async Task<IEnumerable<ProductLinkedDto>> FindWithBrandsAsync(ProductSearchDto searchDto, IEnumerable<int> brands, CancellationToken cancellationToken = default)
    {
        return await FilterProducts(searchDto, product =>
        {
            return brands.Any(b=> b == product.Id);
        });
    }

    private async Task<Product> GetProductById(int id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            throw new NotFoundException($"Product with id {id} not found");
        return product;
    }

    private async Task<IEnumerable<ProductLinkedDto>> FilterProducts(ProductSearchDto searchDto, Func<ProductDto, bool>? filter = null)
    {
        var products = await productRepository.GetAllAsync();
        if (!string.IsNullOrEmpty(searchDto.Query))
            products = products.Where(
                p => p.Title.Contains(searchDto.Query) || p.Description.Contains(searchDto.Query)
            );
        return products.Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();
    }
}