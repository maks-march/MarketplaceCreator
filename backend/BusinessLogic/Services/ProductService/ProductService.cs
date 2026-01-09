using System.Security.Authentication;
using DataAccess.Models;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;
using Shared.Exceptions;

namespace BusinessLogic.Services;

internal class ProductService(IProductRepository productRepository) : 
    CrudService<Product, ProductLinkedDto, ProductCreateDto, ProductUpdateDto>(productRepository),
    IProductService
{
    public override async Task CreateAsync(ProductCreateDto createDto, User user, CancellationToken cancellationToken = default)
    {
        var imageUrls = new List<string>();
        foreach (var image in createDto.ImageFiles)
        {
            string imageUrl = "";
            if (image != null)
            {
                imageUrl = await SaveImageAsync(image, user.Id);
            }
            imageUrls.Add(imageUrl);
        }

        var noImageDto = new ProductCreateImageLinksDto
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Price = createDto.Price,
            BrandId = createDto.BrandId,
            ImageLinks = imageUrls.ToArray()
        };
        var item = Product.Create(noImageDto);
        item = await FillFromUser(item, user, cancellationToken);
        await productRepository.CreateAsync(item, cancellationToken);
    }

    protected override async Task<bool> CheckItem(Product? item, int userId = -1, params string[] valuesCheck)
    {
        await base.CheckItem(item, userId, valuesCheck);
        if (userId != -1 && item!.Brand.Users.All(u => u.Id != userId))
            throw new AuthenticationException("Данный пользователь не может редактировать этот продукт");
        return true;
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
        return products
            .Where(p => filter is null || filter(p)).Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .Select(p => p.GetDto())
            .ToList();
    }
    
    private async Task<string> SaveImageAsync(IFormFile file, int userId)
    {
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{userId}{fileExtension}";
    
        var uploadsPath = Path.Combine("/staticfiles", "uploads");
    
        // ЕСЛИ НЕТ ПАПКИ - СОЗДАЕМ
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);
    
        var fullPath = Path.Combine(uploadsPath, fileName);
    
        // СОХРАНЯЕМ НА ДИСК
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
    
        // ВОЗВРАЩАЕМ ОТНОСИТЕЛЬНЫЙ ПУТЬ
        return $"/uploads/{fileName}";
    }
}