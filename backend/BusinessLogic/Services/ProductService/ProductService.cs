using System.Security.Authentication;
using DataAccess;
using DataAccess.Models;
using DataAccess.Models.Enums;
using DataAccess.Repositories.ProductRepository;
using Shared.DataTransferObjects.Request.ProductDto;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services.ProductService;

internal class ProductService(IProductRepository productRepository) : 
    CrudService<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productRepository),
    IProductService
{
    public override async Task CreateAsync(ProductCreateDto createDto, User user, CancellationToken cancellationToken = default)
    {
        var item = Product.Create(createDto);
        item.ImageLinks = await SaveImagesAsync(createDto.ImageFiles, user.Id);
        item = await FillFromUser(item, user, cancellationToken);
        await productRepository.CreateAsync(item, cancellationToken);
    }

    protected override async Task<bool> CheckItem(Product? item, int userId = -1, params string[] valuesCheck)
    {
        if (userId != -1 && item!.Brand.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return await base.CheckItem(item, userId, valuesCheck);
    }

    protected override async Task<Product> FillFromUser(Product item, User user, CancellationToken cancellationToken)
    {
        var brand = user.Brands.FirstOrDefault(b => b.Id == item.BrandId);
        if (brand is null)
            throw new NotFoundException($"Бренда с id {item.BrandId} не найдено");
        item.Brand = brand;
        return await base.FillFromUser(item, user, cancellationToken);
    }

    public async Task<IEnumerable<ProductLinkedDto>> GetFilteredAsync(ProductSearchDto searchDto, Func<Product, bool>? filter = null, CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        if (!string.IsNullOrEmpty(searchDto.Query))
            products = products.Where(
                p => p.Title.Contains(searchDto.Query) || p.Description.Contains(searchDto.Query)
            );
        if (!string.IsNullOrEmpty(searchDto.ColorScheme) && 
            EnumConverter.TryConvertToEnum(searchDto.ColorScheme, out ColorScheme colorScheme))
            products = products.Where(
                p => p.Color == colorScheme
            );
        if (!string.IsNullOrEmpty(searchDto.Category) && 
            EnumConverter.TryConvertToEnum(searchDto.Category, out ProductCategory productCategory))
            products = products.Where(
                p => p.ProductCategory == productCategory
            );
        return products
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetDto())
            .ToList();
    }
}