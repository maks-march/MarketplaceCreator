using DataAccess;
using Shared.DataTransferObjects;

namespace BusinessLogic;

internal class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task CreateAsync(string title, string description = "", CancellationToken cancellationToken = default)
    {
        var product = new Product()
        {
            Title = title,
            Description = description
        };
        await productRepository.CreateAsync(product, cancellationToken);
    }

    public async Task<string> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        if (product is null)
            throw new Exception("No product found");

        return product.Title;
    }

    public async Task UpdateByIdAsync(int id, string title, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            throw new Exception("No product found");
        
        product.Title = title;
        await productRepository.UpdateByIdAsync(product, cancellationToken);
    }

    public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken = default)
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